import request from 'supertest';
import { faker } from '@faker-js/faker';

import { Server } from '../../src/server/server';
import { LocationMother } from '../utils/mother/location-mother';
import {
  cleanDatabaseAssignmentTesting,
  cleanDatabaseLocationTesting
} from '../utils/db';

import { LocationModel } from '../../src/contexts/shared/infrastructure/models/parking/location.model';
import { SlotModel } from '../../src/contexts/shared/infrastructure/models/parking/slot.model';
import {
  BenefitType,
  SlotStatus,
  SlotType,
  VehicleType
} from '../../src/contexts/location/core/entities/slot-entity';
import { LocationStatus } from '../../src/contexts/location/core/entities/location-entity';
import { AssignmentBuilder } from '../utils/builders/assignment-builder';
import {
  LocationBuilder,
  SlotBuilder
} from '../utils/builders/location-builder';
import { AssignmentStatus } from '../../src/contexts/assignment/core/entities/assignment-entity';
import { LocationHelper } from '../utils/helpers/location-helper';

const baseUrl = '/api/v1/parking/location';
const server = new Server();

beforeAll(async () => {
  await server.startServer();
  await cleanDatabaseAssignmentTesting();
  await cleanDatabaseLocationTesting();
});

afterEach(async () => {
  await cleanDatabaseAssignmentTesting();
  await cleanDatabaseLocationTesting();
});

afterAll(async () => {
  await server.stopServer();
});

describe('(e2e) Location and Slots', () => {
  describe('/parking/location', () => {
    describe('POST', () => {
      it('should return 201 and persist location and slots when the request is valid', async () => {
        const locationRequest = LocationMother.createLocationRequest();

        const response = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequest)
          .expect(201)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(response.body).toEqual({ message: 'Location created' });
        expect(locations).toHaveLength(1);
        expect(locations[0]).toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address
        });
        expect(slots).toHaveLength(locationRequest.slots.length);
      });

      it('should return 400 and not persist any location if required fields are missing', async () => {
        const response = await request(server.getApp())
          .post(`${baseUrl}`)
          .send({})
          .expect(400)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty('message');
        expect(locations).toHaveLength(0);
        expect(slots).toHaveLength(0);
      });

      it("should return 400 if a slot has status 'OCUPADO'", async () => {
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots[0].status = 'OCUPADO';

        const response = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequest)
          .expect(400)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0].code).toContain('invalid_enum_value');
        expect(locations).toHaveLength(0);
        expect(slots).toHaveLength(0);
      });

      it('should return 400 if slot is MULTIPLE with limit of 1 or SIMPLE with limit greater than 1', async () => {
        const locationRequestMultiple = LocationMother.createLocationRequest();
        locationRequestMultiple.slots[0].slotType = 'MULTIPLE';
        locationRequestMultiple.slots[0].limitOfAssignments = 1;

        const locationRequestSimple = LocationMother.createLocationRequest();
        locationRequestSimple.slots[0].slotType = 'SIMPLE';
        locationRequestSimple.slots[0].limitOfAssignments = 10;

        const responseMultiple = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequestMultiple)
          .expect(400)
          .expect('Content-Type', /json/);

        const responseSimple = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequestSimple)
          .expect(400)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(responseMultiple.body).toHaveProperty('message');
        expect(responseMultiple.body.message).toEqual(
          'The number of schedules for a multiple space should be greater than 1.'
        );

        expect(responseSimple.body).toHaveProperty('message');
        expect(responseSimple.body.message).toEqual(
          'The number of schedules cannot be greater than 1 or less than 1 for SIMPLE type spaces.'
        );

        expect(locations).toHaveLength(0);
        expect(slots).toHaveLength(0);
      });

      it('should return 400 if benefitType is DESCUENTO or COMPLEMENTO and amount is invalid', async () => {
        const locationRequestDiscount = LocationMother.createLocationRequest();
        locationRequestDiscount.slots[0].benefitType = 'DESCUENTO';
        locationRequestDiscount.slots[0].amount = -1;

        const locationRequestComplement =
          LocationMother.createLocationRequest();
        locationRequestComplement.slots[0].benefitType = 'COMPLEMENTO';
        locationRequestComplement.slots[0].amount = -1;

        const responseDiscount = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequestDiscount)
          .expect(400)
          .expect('Content-Type', /json/);

        const responseComplement = await request(server.getApp())
          .post(`${baseUrl}`)
          .send(locationRequestComplement)
          .expect(400)
          .expect('Content-Type', /json/);

        const locations = await LocationModel.findAll({ raw: true });
        const slots = await SlotModel.findAll({ raw: true });

        expect(responseDiscount.body.message[0]).toHaveProperty('message', 'Number must be greater than or equal to 0');
        expect(responseComplement.body.message[0]).toHaveProperty('message', 'Number must be greater than or equal to 0');

        expect(locations).toHaveLength(0);
        expect(slots).toHaveLength(0);
      });
    });

    describe('GET', () => {
      describe('/', () => {
        it('Con registros en BD se deberá recibir un arreglo de ubicaciones con su estadística de ocupación según el estado de los slots y un contador de páginas', async () => {
          const locationEntity = LocationMother.createLocationEntity();
          await LocationModel.create(locationEntity.toPrimitives());
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.OCCUPIED,
            locationId: locationEntity.id
          });
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.ACTIVE,
            locationId: locationEntity.id
          });
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.INACTIVE,
            locationId: locationEntity.id
          });

          const locationDatabase = await LocationModel.findAll({ raw: true });

          const response = await request(server.getApp())
            .get(`${baseUrl}?limit=1&page=1`)
            .expect(200);

          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toBeInstanceOf(Array);
          expect(response.body.data).toHaveLength(1);
          expect(locationDatabase[0]).toMatchObject({
            id: response.body.data[0].id,
            name: response.body.data[0].name,
            address: response.body.data[0].address
          });
          expect(response.body.data[0]).toMatchObject({
            totalSlots: 3,
            availableSlots: 1,
            unavailableSlots: 1,
            occupiedSlots: 1
          });
          expect(response.body).toHaveProperty('pageCounter', 1);
        });

        it('Si se envía un limite o pagina como texto, número negativo se recibe un 400 por estructura erronea de la petición', async () => {
          const response1 = await request(server.getApp())
            .get(`${baseUrl}?limit=abc&page=1`)
            .expect(400);
          expect(response1.body).toHaveProperty('message');
          expect(response1.body.message[0]).toHaveProperty(
            'message',
            'Expected number, received nan'
          );

          const response2 = await request(server.getApp())
            .get(`${baseUrl}?limit=-1&page=1`)
            .expect(400);
          expect(response2.body).toHaveProperty('message');
          expect(response2.body.message[0]).toHaveProperty(
            'message',
            'Number must be greater than or equal to 1'
          );

          const response3 = await request(server.getApp())
            .get(`${baseUrl}?limit=1&page=abc`)
            .expect(400);
          expect(response3.body).toHaveProperty('message');
          expect(response3.body.message[0]).toHaveProperty(
            'message',
            'Expected number, received nan'
          );

          const response4 = await request(server.getApp())
            .get(`${baseUrl}?limit=1&page=-1`)
            .expect(400);
          expect(response4.body).toHaveProperty('message');
          expect(response4.body.message[0]).toHaveProperty(
            'message',
            'Number must be greater than or equal to 1'
          );
        });

        it('Si se envía un limite mayor a 100, se recibe un 400 por limitación configurada en backend', async () => {
          const response = await request(server.getApp())
            .get(`${baseUrl}?limit=101&page=1`)
            .expect(400);
          expect(response.body).toHaveProperty('message');
          expect(response.body.message[0]).toHaveProperty(
            'message',
            'Number must be less than or equal to 100'
          );
        });
      });

      describe('/:location_id', () => {
        it('A partir de un id (uuid) debería devolver una ubicación existente en base de datos y un arreglo de slots asociados', async () => {
          const locationEntity = LocationMother.createLocationEntity();
          const slotEntity = LocationMother.createSlotEntity();
          await LocationModel.create(locationEntity.toPrimitives());
          await SlotModel.create({
            ...slotEntity.toPrimitives(),
            locationId: locationEntity.id
          });
          const slotDatabase = await SlotModel.findAll({ raw: true });
          const locationDatabase = await LocationModel.findAll({ raw: true });

          const response = await request(server.getApp())
            .get(`${baseUrl}/${locationEntity.id}`)
            .expect(200);

          const { body } = response;
          expect(body).toHaveProperty('data');
          expect(locationDatabase[0]).toMatchObject({
            name: body.data.name,
            address: body.data.address
          });
          expect(slotDatabase).toHaveLength(1);
          expect(slotDatabase[0]).toMatchObject({
            slotNumber: body.data.slots[0].slotNumber,
            slotType: body.data.slots[0].slotType,
            limitOfAssignments: body.data.slots[0].limitOfAssignments,
            benefitType: body.data.slots[0].benefitType,
            amount: body.data.slots[0].amount,
            vehicleType: body.data.slots[0].vehicleType,
            status: body.data.slots[0].status
          });
        });

        it('Si un id no cumple con el formato uuid debería devolver un error 400 solicitando la estructura de id correcta', async () => {
          const response = await request(server.getApp())
            .get(`${baseUrl}/abc`)
            .expect(400);
          expect(response.body).toHaveProperty('message');
          expect(response.body.message[0]).toHaveProperty(
            'message',
            'Invalid uuid'
          );
        });

        it('Se recibe un 404 al enviar un id (uuid) inexistente', async () => {
          const response = await request(server.getApp())
            .get(`${baseUrl}/${faker.string.uuid()}`)
            .expect(404);
          expect(response.body).toHaveProperty('message', 'Location not found');
        });
      });

      describe('/stats', () => {
        it('Se recibe un recuento del estado actual de los slots según sus estados en base de datos', async () => {
          const locationEntity = LocationMother.createLocationEntity();
          await LocationModel.create(locationEntity.toPrimitives());
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.OCCUPIED,
            locationId: locationEntity.id
          });
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.ACTIVE,
            locationId: locationEntity.id
          });
          await SlotModel.create({
            ...LocationMother.createSlotEntity().toPrimitives(),
            status: SlotStatus.INACTIVE,
            locationId: locationEntity.id
          });

          const response = await request(server.getApp())
            .get(`${baseUrl}/stats/overview`)
            .expect(200);

          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toMatchObject({
            totalSlots: 3,
            availableSlots: 1,
            unavailableSlots: 1,
            occupiedSlots: 1
          });
        });

        it('cuando se consulta las tendencias según tipo (daily, weekly, monthly) se debería recibir un arreglo de objetos con los datos', async () => {
          const trendDaily = await request(server.getApp())
            .get(`${baseUrl}/stats/trend?type=daily`)
            .expect(200)
            .expect('Content-Type', /json/);

          const trendWeekly = await request(server.getApp())
            .get(`${baseUrl}/stats/trend?type=weekly`)
            .expect(200)
            .expect('Content-Type', /json/);

          const trendMonthly = await request(server.getApp())
            .get(`${baseUrl}/stats/trend?type=monthly`)
            .expect(200)
            .expect('Content-Type', /json/);

          expect(trendDaily.body).toHaveProperty('data');
          expect(trendWeekly.body).toHaveProperty('data');
          expect(trendMonthly.body).toHaveProperty('data');
        });

        it('cuando se solicita un tipo de tendencia inexistente se debería recibir un 400 con un mensaje de error indicando que el tipo solicitado no es válido', async () => {
          const response = await request(server.getApp())
            .get(`${baseUrl}/stats/trend?type=abc`)
            .expect(400);
          expect(response.body).toHaveProperty('message');
          expect(response.body.message[0]).toHaveProperty(
            'message',
            "Invalid enum value. Expected 'daily' | 'weekly' | 'monthly', received 'abc'"
          );
        });
      });

      describe('/available-slots', () => {
        it('Se recibe un arreglo de slots disponibles según tipo de vehículo y ubicación indicada', async () => {
          const location = await new LocationBuilder()
            .withActiveStatus()
            .build();
          const slot1 = await new SlotBuilder()
            .withAvailableStatus()
            .withTypeSingle()
            .withVehicleType(VehicleType.CAR)
            .build(location.id);
          const slot2 = await new SlotBuilder()
            .withAvailableStatus()
            .withTypeSingle()
            .withVehicleType(VehicleType.CAR)
            .build(location.id);
          const slot3 = await new SlotBuilder()
            .withTypeSingle()
            .withOccupiedStatus()
            .withVehicleType(VehicleType.CAR)
            .build(location.id);
          const slot4 = await new SlotBuilder()
            .withOccupiedStatus()
            .withTypeMultiple(2)
            .withVehicleType(VehicleType.CAR)
            .build(location.id);
          await new AssignmentBuilder().buildWithActiveStatusFromSlotProvided(
            AssignmentStatus.ASSIGNED,
            slot4
          );
          const slot5 = await new SlotBuilder()
            .withOccupiedStatus()
            .withTypeMultiple(2)
            .withVehicleType(VehicleType.CAR)
            .build(location.id);
          await new AssignmentBuilder().buildWithActiveStatusFromSlotProvided(
            AssignmentStatus.ASSIGNED,
            slot5
          );

          const response = await request(server.getApp())
            .get(`${baseUrl}/available-slots/${location.id}?vehicleType=${VehicleType.CAR}`)
            .expect(200);

          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toHaveLength(4);
          const validateSchema = (data: any[], slot: any) => {
            expect(data.find((s: any) => s.id === slot.id)).toMatchObject({
              id: slot.id,
              slotNumber: slot.slotNumber,
              slotType: slot.slotType,
              benefitType: slot.benefitType
            });
          };
          validateSchema(response.body.data, slot1);
          validateSchema(response.body.data, slot2);
          validateSchema(response.body.data, slot4);
          validateSchema(response.body.data, slot5);

          expect(
            response.body.data.some((slot: any) => slot.id === slot3.id)
          ).toBeFalsy();
        });

        it('Se obtiene un arreglo vacio si la ubicación está inactiva', async () => {
          const location = await new LocationBuilder()
            .withInactiveStatus()
            .build();
          await new SlotBuilder()
            .withAvailableStatus()
            .withTypeSingle()
            .withVehicleType(VehicleType.CAR)
            .build(location.id);
          await new SlotBuilder()
            .withAvailableStatus()
            .withTypeMultiple(2)
            .withVehicleType(VehicleType.CAR)
            .build(location.id);

          const response = await request(server.getApp())
            .get(`${baseUrl}/available-slots/${location.id}?vehicleType=${VehicleType.CAR}`)
            .expect(200);

          expect(response.body.data).toHaveLength(0);
        });

        it('No se acepta la petición si el id de ubicación no existe', async () => {
          const response = await request(server.getApp())
            .get(`${baseUrl}/available-slots/${faker.string.uuid()}?vehicleType=${VehicleType.CAR}`)
            .expect(404);
          expect(response.body).toHaveProperty('message', 'Location not found');
        });

        it('Se valida correctamente estructura de petición', async () => {
          const response1 = await request(server.getApp())
            .get(`${baseUrl}/available-slots/${faker.string.uuid()}?vehicleType=abc`)
            .expect(400);
          const response2 = await request(server.getApp())
            .get(`${baseUrl}/available-slots/abc?vehicleType=${VehicleType.CAR}`)
            .expect(400);

          expect(response1.body.message[0]).toHaveProperty(
            'message',
            "Invalid enum value. Expected 'CARRO' | 'MOTO' | 'CAMION', received 'abc'"
          );
          expect(response2.body.message[0]).toHaveProperty(
            'message',
            'Invalid uuid'
          );
        });
      });
    });

    describe('PUT', () => {
      it('Se actualiza una ubicación y slots correctamente a partir de request correcto', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        const slotEntity = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        };
        const slotEntity2 = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        };
        await LocationModel.create(locationEntity.toPrimitives());
        await SlotModel.create(slotEntity);
        await SlotModel.create(slotEntity2);
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [
          { ...locationRequest.slots[0], id: slotEntity.id },
          {...locationRequest.slots[1]}
        ];
        locationRequest.slotsToDelete = [slotEntity2.id];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(200);

        expect(response.body).toEqual({ message: 'Location updated' });
        const locationDatabase = await LocationModel.findAll({ raw: true });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(locationDatabase).toHaveLength(1);
        expect(locationDatabase[0]).toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
        expect(slotDatabase).toHaveLength(2);
        expect(slotDatabase.find((slot: any) => slot.id === locationRequest.slots[0].id)).toMatchObject({
          slotNumber: locationRequest.slots[0].slotNumber,
          slotType: locationRequest.slots[0].slotType,
          limitOfAssignments: locationRequest.slots[0].limitOfAssignments,
          benefitType: locationRequest.slots[0].benefitType,
          amount: locationRequest.slots[0].amount,
          vehicleType: locationRequest.slots[0].vehicleType,
          status: locationRequest.slots[0].status
        });
      });

      it('Si un slot no tiene id, se creará en base de datos', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [
          LocationMother.createSlotRequest(),
          LocationMother.createSlotRequest()
        ];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(200);

        console.log(response.body);

        expect(response.body).toEqual({ message: 'Location updated' });
        const locationDatabase = await LocationModel.findAll({ raw: true });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(locationDatabase).toHaveLength(1);
        expect(locationDatabase[0]).toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
        expect(slotDatabase).toHaveLength(locationRequest.slots.length);
      });

      it('Se rechaza petición si un slot tiene id que no pertenece a la ubicación', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const locationRequest = LocationMother.createLocationRequest();
        const slotId = faker.string.uuid();
        locationRequest.slots = [LocationMother.createSlotRequest(slotId)];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          `You cannot update slot with id ${slotId} because it does not belong to location`
        );

        const locationDatabase = await LocationModel.findAll({ raw: true });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(locationDatabase).toHaveLength(1);
        expect(slotDatabase).toHaveLength(0);
        expect(locationDatabase[0]).not.toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
      });

      it('No se permite poder crear slots nuevos con estado "OCUPADO"', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [
          LocationMother.addNewStatusToSlot(
            LocationMother.createSlotRequest(),
            SlotStatus.OCCUPIED
          )
        ];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          'You cannot create a slot with occupied status'
        );

        const locationDatabase = await LocationModel.findAll({ raw: true });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(locationDatabase).toHaveLength(1);
        expect(slotDatabase).toHaveLength(0);
        expect(locationDatabase[0]).not.toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
      });

      it('No se permite crear un slot si su tipo es "MULTIPLE" y el número máximo de asignaciones es igual 1', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [
          {
            ...LocationMother.createSlotRequest(),
            slotType: SlotType.MULTIPLE,
            limitOfAssignments: 1
          }
        ];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          'The number of schedules for a multiple space should be greater than 1.'
        );

        const locationDatabase = await LocationModel.findAll({ raw: true });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(locationDatabase).toHaveLength(1);
        expect(slotDatabase).toHaveLength(0);
        expect(locationDatabase[0]).not.toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
      });

      it('No se permite crear un slot si su tipo es "SIMPLE" y el número máximo de asignaciones es mayor a 1', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [
          {
            ...LocationMother.createSlotRequest(),
            slotType: SlotType.SIMPLE,
            limitOfAssignments: 2
          }
        ];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          'The number of schedules cannot be greater than 1 or less than 1 for SIMPLE type spaces.'
        );

        const locationDatabase = await LocationModel.findAll({ raw: true });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(locationDatabase).toHaveLength(1);
        expect(slotDatabase).toHaveLength(0);
        expect(locationDatabase[0]).not.toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
      });

      it('No se permite crear slots si el número de asignaciones máximo es menor a 1', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [
          { ...LocationMother.createSlotRequest(), limitOfAssignments: 0 }
        ];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(400);

        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Number must be greater than or equal to 1'
        );

        const locationDatabase = await LocationModel.findAll({ raw: true });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(locationDatabase).toHaveLength(1);
        expect(slotDatabase).toHaveLength(0);
        expect(locationDatabase[0]).not.toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
      });

      it('No se permite inactivar ubicación si tiene asignaciones activas', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create({
          ...locationEntity.toPrimitives(),
          status: LocationStatus.ACTIVE
        });
        await SlotModel.create({
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id,
          status: SlotStatus.OCCUPIED
        });

        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.status = LocationStatus.INACTIVE;

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          'You cannot inactivate a location with active assignments'
        );

        const locationDatabase = await LocationModel.findAll({ raw: true });
        expect(locationDatabase[0]).not.toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
      });

      it('No se permite cambiar la propiedad "BENEFIT_TYPE" de un slot si está ocupado', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const slotEntity = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id,
          status: SlotStatus.OCCUPIED,
          benefitType: BenefitType.NO_COST,
          amount: 0
        };
        await SlotModel.create(slotEntity);
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [
          {
            ...LocationMother.createSlotRequest(slotEntity.id),
            benefitType: BenefitType.COMPLEMENT,
            amount: 100
          }
        ];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          'You cannot update properties slotType, vehicleType, benefitType, status, amount if it is occupied'
        );

        const locationDatabase = await LocationModel.findAll({ raw: true });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(locationDatabase).toHaveLength(1);
        expect(slotDatabase).toHaveLength(1);
        expect(locationDatabase[0]).not.toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
        expect(slotDatabase[0]).not.toMatchObject({
          slotNumber: locationRequest.slots[0].slotNumber,
          slotType: locationRequest.slots[0].slotType,
          limitOfAssignments: locationRequest.slots[0].limitOfAssignments,
          benefitType: locationRequest.slots[0].benefitType,
          amount: locationRequest.slots[0].amount,
          vehicleType: locationRequest.slots[0].vehicleType,
          status: locationRequest.slots[0].status
        });
      });

      it('No se permite cambiar la propiedad "TYPE_VEHICLE" de un slot si está ocupado', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const slotEntity = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id,
          status: SlotStatus.OCCUPIED,
          benefitType: BenefitType.NO_COST,
          vehicleType: VehicleType.CAR,
          amount: 0
        };
        await SlotModel.create(slotEntity);
        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [
          {
            ...LocationMother.createSlotRequest(slotEntity.id),
            vehicleType: VehicleType.CYCLE
          }
        ];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send(locationRequest)
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          'You cannot update properties slotType, vehicleType, benefitType, status, amount if it is occupied'
        );

        const locationDatabase = await LocationModel.findAll({ raw: true });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(locationDatabase).toHaveLength(1);
        expect(slotDatabase).toHaveLength(1);
        expect(locationDatabase[0]).not.toMatchObject({
          name: locationRequest.name,
          address: locationRequest.address,
          contactReference: locationRequest.contactReference,
          phone: locationRequest.phone,
          email: locationRequest.email,
          comments: locationRequest.comments,
          numberOfIdentifier: locationRequest.numberOfIdentifier
        });
        expect(slotDatabase[0]).not.toMatchObject({
          slotNumber: locationRequest.slots[0].slotNumber,
          slotType: locationRequest.slots[0].slotType,
          limitOfAssignments: locationRequest.slots[0].limitOfAssignments,
          benefitType: locationRequest.slots[0].benefitType,
          amount: locationRequest.slots[0].amount,
          vehicleType: locationRequest.slots[0].vehicleType,
          status: locationRequest.slots[0].status
        });
      });

      it.skip('No se permite modificar el número máximo de asignaciones de un slot por debajo del número de asignaciones activas', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const slotEntity = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          status: SlotStatus.OCCUPIED,
          slotType: SlotType.MULTIPLE,
          limitOfAssignments: 2
        };
        await SlotModel.create(slotEntity);
      });

      it('Al enviar ids de slos para eliminar, se eliminan correctamente', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const slotEntity = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        };
        const slotEntity2 = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        };
        const slotEntity3 = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        };
        await SlotModel.create(slotEntity);
        await SlotModel.create(slotEntity2);
        await SlotModel.create(slotEntity3);

        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send({
            ...locationRequest,
            slotsToDelete: [slotEntity.id, slotEntity2.id]
          })
          .expect(200);

        expect(response.body).toEqual({ message: 'Location updated' });
        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(slotDatabase).toHaveLength(1);
      });

      it('Si algun slot a eliminar no pertenece a la ubicación se rechaza la petición', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const slotEntity = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        };
        const slotEntity2 = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        };
        await SlotModel.create(slotEntity);
        await SlotModel.create(slotEntity2);

        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [];

        const randomSlotId = faker.string.uuid();
        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send({
            ...locationRequest,
            slotsToDelete: [slotEntity.id, slotEntity2.id, randomSlotId]
          })
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          `You cannot delete slot with id ${randomSlotId} because it does not belong to location`
        );

        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(slotDatabase).toHaveLength(2);
      });

      it('Si un slot con estado "OCUPADO" es enviado para eliminar se rechaza la petición', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const slotEntity = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id,
          status: SlotStatus.OCCUPIED
        };
        await SlotModel.create(slotEntity);

        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send({ ...locationRequest, slotsToDelete: [slotEntity.id] })
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          'You cannot delete a slot with active assignments'
        );

        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(slotDatabase).toHaveLength(1);
      });

      it('Se rechaza la petición si se envía un id para eliminar que no sea uuid', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());
        const slotEntity = {
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        };
        await SlotModel.create(slotEntity);

        const locationRequest = LocationMother.createLocationRequest();
        locationRequest.slots = [];

        const response = await request(server.getApp())
          .put(`${baseUrl}/${locationEntity.id}`)
          .send({ ...locationRequest, slotsToDelete: ['abc'] })
          .expect(400);

        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Invalid uuid'
        );

        const slotDatabase = await SlotModel.findAll({ raw: true });
        expect(slotDatabase).toHaveLength(1);
      });
    });

    describe('DELETE', () => {
      it('Se elimina una ubicación y sus slots asociados con un id (uuid) válido', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());

        await SlotModel.create({
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id
        });

        const response = await request(server.getApp())
          .delete(`${baseUrl}/${locationEntity.id}`)
          .expect(200);

        const slotDatabase = await SlotModel.findAll({ raw: true });
        const locationDatabase = await LocationModel.findAll({ raw: true });
        expect(response.body).toEqual({
          message: 'Location deleted'
        });
        expect(slotDatabase).toHaveLength(0);
        expect(locationDatabase).toHaveLength(0);
      });

      it('Si la ubicación tiene al menos un slot "OCUPADO" no se puede eliminar', async () => {
        const locationEntity = LocationMother.createLocationEntity();
        await LocationModel.create(locationEntity.toPrimitives());

        await SlotModel.create({
          ...LocationMother.createSlotEntity().toPrimitives(),
          locationId: locationEntity.id,
          status: SlotStatus.OCCUPIED
        });
        const locationDatabase = await LocationModel.findAll({ raw: true });
        const response = await request(server.getApp())
          .delete(`${baseUrl}/${locationEntity.id}`)
          .expect(400);

        expect(response.body).toHaveProperty(
          'message',
          'You cannot delete a location with active assignments'
        );
        expect(locationDatabase).toHaveLength(1);
      });

      it('Cuando un id (uuid) no cumple con el formato uuid se debería recibir un 400 solicitando la estructura de id correcta', async () => {
        const response = await request(server.getApp())
          .delete(`${baseUrl}/abc`)
          .expect(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Invalid uuid'
        );
      });

      it('Cuando se envía un id (uuid) inexistente indica que no existe la ubicación', async () => {
        const response = await request(server.getApp())
          .delete(`${baseUrl}/${faker.string.uuid()}`)
          .expect(404);
        expect(response.body).toHaveProperty('message', 'Location not found');
      });
    });
  });
});

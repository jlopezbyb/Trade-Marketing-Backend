import request from 'supertest';

import { Server } from '../../src/server/server';
import { cleanDatabaseAssignmentTesting } from '../utils/db';
import { cleanDatabaseLocationTesting } from '../utils/db';
import { cleanDatabaseTagTesting } from '../utils/db';
import { cleanDatabaseParameterTesting } from '../utils/db';

import { AssignmentRequestMother } from '../utils/mother/assignment-mother';
import { AcceptanceFormRequestMother } from '../utils/mother/assignment-mother';

import { LocationBuilder } from '../utils/builders/location-builder';
import { SlotBuilder } from '../utils/builders/location-builder';
import { TagBuilder } from '../utils/builders/tag-builder';
import { AssignmentHelper } from '../utils/helpers/assignment-helper';
import { LocationHelper } from '../utils/helpers/location-helper';
import { SlotStatus } from '../../src/contexts/location/core/entities/slot-entity';
import { faker } from '@faker-js/faker';
import { AssignmentBuilder } from '../utils/builders/assignment-builder';
import { VehicleBuilder } from '../utils/builders/vehicle-builder';
import { EmployeeBuilder } from '../utils/builders/employee-builder';
import { AssignmentStatus } from '../../src/contexts/assignment/core/entities/assignment-entity';
import { ParametersHelper } from '../utils/helpers/parameters-helper';
import { SettingBuilder } from '../utils/builders/setting-builder';

const baseUrl = '/api/v1/assignment';
const server = new Server();

beforeAll(async () => {
  await server.startServer();
  await cleanDatabaseAssignmentTesting();
  await cleanDatabaseLocationTesting();
  await cleanDatabaseTagTesting();
  await cleanDatabaseParameterTesting();
});

afterEach(async () => {
  await cleanDatabaseAssignmentTesting();
  await cleanDatabaseLocationTesting();
  await cleanDatabaseTagTesting();
  await cleanDatabaseParameterTesting();
});

afterAll(async () => {
  await server.stopServer();
});

describe('E2E: Assignment', () => {
  describe('Assignments', () => {
    describe('POST', () => {
      const sendRequest = async (
        requestData: any,
        statusCodeExpected: number
      ) => {
        return await request(server.getApp())
          .post(`${baseUrl}`)
          .send(requestData)
          .expect(statusCodeExpected)
          .expect('Content-Type', /json/);
      };
      it('Con un request correcto se crea una asignación, empleado, vehiculo, etiquetado y cambia estado de slot', async () => {
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withAvailableStatus()
          .withTypeSingle()
          .build(location.id);
        const tag = await new TagBuilder().build();
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });

        const response = await sendRequest(requestData, 201);

        expect(response.body).toEqual({ message: 'Assignment created' });
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        const [slotDatabase] = await LocationHelper.getAllSlots();
        expect(slotDatabase.status).toBe(SlotStatus.OCCUPIED);
        expect(assignments).toHaveLength(1);
        expect(employees).toHaveLength(1);
        expect(vehicles).toHaveLength(1);
        expect(assignments[0]).toMatchObject({
          slotId: slot.id,
          employeeId: employees[0].id,
          parkingCardNumber: requestData.parkingCardNumber,
          assignmentDate: null
        });
        expect(employees[0]).toMatchObject({
          employeeCode: requestData.employee!.employeeCode,
          name: requestData.employee!.name,
          workplace: requestData.employee!.workplace,
          identifierDocument: requestData.employee!.identifierDocument,
          company: requestData.employee!.company,
          department: requestData.employee!.department,
          subManagement: requestData.employee!.subManagement,
          management1: requestData.employee!.management1,
          management2: requestData.employee!.management2
        });
        expect(vehicles[0]).toMatchObject({
          vehicleBadge: requestData.employee!.vehicles![0].vehicleBadge,
          color: requestData.employee!.vehicles![0].color,
          brand: requestData.employee!.vehicles![0].brand,
          model: requestData.employee!.vehicles![0].model,
          type: requestData.employee!.vehicles![0].type
        });
      });

      it('Para slot MULTIPLE se crean asignaciones según límite establecido en slot', async () => {
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withAvailableStatus()
          .withTypeMultiple(2)
          .build(location.id);
        const tag = await new TagBuilder().build();
        const requestData1 = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });
        const requestData2 = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });
        const requestData3 = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });

        await sendRequest(requestData1, 201);
        await sendRequest(requestData2, 201);
        const response = await sendRequest(requestData3, 400);

        expect(response.body).toHaveProperty(
          'message',
          'You can not create more assignments in this slot'
        );
        const assignmentsDatabase = await AssignmentHelper.getAllAssignments();
        const employeesDatabase = await AssignmentHelper.getAllEmployees();
        const vehiclesDatabase = await AssignmentHelper.getAllVehicles();
        const [slotDatabase] = await LocationHelper.getAllSlots();
        expect(slotDatabase.status).toBe(SlotStatus.OCCUPIED);
        expect(assignmentsDatabase).toHaveLength(2);
        expect(employeesDatabase).toHaveLength(2);
        expect(vehiclesDatabase).toHaveLength(2);
      });

      it('No se puede dos asignaciones para un mismo empleados si la primera asignación está en curso', async () => {
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withAvailableStatus()
          .withTypeMultiple(2)
          .build(location.id);
        const tag = await new TagBuilder().build();
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });

        await sendRequest(requestData, 201);

        const timeOut = setTimeout(async () => {
          const response = await sendRequest(requestData, 400);

          expect(response.body).toHaveProperty(
            'message',
            'You can not create a new assignment for the same employee because the previous one is in progress'
          );
        }, 1000);
        clearTimeout(timeOut);
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(1);
        expect(employees).toHaveLength(1);
        expect(vehicles).toHaveLength(1);
      });

      it('Se puede crear asignación para un empleado existente y con asignaciones previas pero inactivas', async () => {
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withAvailableStatus()
          .build(location.id);
        const tag = await new TagBuilder().build();
        const prevAssignment =
          await new AssignmentBuilder().buildWithDeAssignedStatus(
            AssignmentStatus.MANUAL_DE_ASSIGNMENT
          );
        const employee = AssignmentRequestMother.createEmployeeRequest({
          id: prevAssignment.employee.id,
          employeeCode: prevAssignment.employee.employeeCode
        });
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          employee,
          tags: [tag.id]
        });

        const response = await sendRequest(requestData, 201);

        expect(response.body).toEqual({ message: 'Assignment created' });
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(2);
        expect(employees).toHaveLength(1);
        expect(vehicles).toHaveLength(2);
      });

      it('Validación de estructura para datos del empleado y vehículo al crear una asignación', async () => {
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withAvailableStatus()
          .withTypeSingle()
          .build(location.id);
        const tag = await new TagBuilder().build();
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });
        delete requestData.employee!.employeeCode;

        const response = await sendRequest(requestData, 400);

        const requestData2 = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });

        delete requestData2.employee!.vehicles![0].vehicleBadge;

        const response2 = await sendRequest(requestData2, 400);

        expect(response.body.message[0]).toHaveProperty('path', [
          'employee',
          'employeeCode'
        ]);
        expect(response2.body.message[0]).toHaveProperty('path', [
          'employee',
          'vehicles',
          0,
          'vehicleBadge'
        ]);
        const assignment = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignment).toHaveLength(0);
        expect(employees).toHaveLength(0);
        expect(vehicles).toHaveLength(0);
      });

      it('No se puede crear asignación a un slot que no existe', async () => {
        const tag = await new TagBuilder().build();
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: faker.string.uuid(),
          tags: [tag.id]
        });

        const response = await sendRequest(requestData, 404);

        expect(response.body).toHaveProperty('message', 'Slot not found');
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(0);
        expect(employees).toHaveLength(0);
        expect(vehicles).toHaveLength(0);
      });

      it('Slot enviado deberá ser un UUID', async () => {
        const tag = await new TagBuilder().build();
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: 'abc',
          tags: [tag.id]
        });

        const response = await sendRequest(requestData, 400);

        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Invalid uuid'
        );
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(0);
        expect(employees).toHaveLength(0);
        expect(vehicles).toHaveLength(0);
      });

      it('No se puede crear asignación para un slot DISPONIBLE pero con la ubicación INACTIVA', async () => {
        const location = await new LocationBuilder()
          .withInactiveStatus()
          .build();
        const slot = await new SlotBuilder()
          .withAvailableStatus()
          .withTypeSingle()
          .build(location.id);
        const tag = await new TagBuilder().build();
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });

        const response = await sendRequest(requestData, 400);

        expect(response.body).toHaveProperty(
          'message',
          'You can not create an assignment if the location is inactive'
        );
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(0);
        expect(employees).toHaveLength(0);
        expect(vehicles).toHaveLength(0);
      });

      it('No se puede crear asignación para un slot SIMPLE y estado OCUPADO', async () => {
        it;
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withOccupiedStatus()
          .withTypeSingle()
          .build(location.id);
        const tag = await new TagBuilder().build();
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });

        const response = await sendRequest(requestData, 400);

        expect(response.body).toHaveProperty(
          'message',
          'Slot is occupied, you can not create an assignment in this slot'
        );
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(0);
        expect(employees).toHaveLength(0);
        expect(vehicles).toHaveLength(0);
      });

      it('No se puede crear asignación para un slot INACTIVO', async () => {
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withInactiveStatus()
          .withTypeSingle()
          .build(location.id);
        const tag = await new TagBuilder().build();
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id]
        });

        const response = await sendRequest(requestData, 400);

        expect(response.body).toHaveProperty(
          'message',
          'Slot is not available'
        );
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(0);
        expect(employees).toHaveLength(0);
        expect(vehicles).toHaveLength(0);
      });

      it('No se puede crear una asignación para un empleado nuevo y con vehículo identificado con UUID', async () => {
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withAvailableStatus()
          .withTypeSingle()
          .build(location.id);
        const tag = await new TagBuilder().build();
        const vehicle = AssignmentRequestMother.createVehicleRequest({
          id: faker.string.uuid()
        });
        const employee = AssignmentRequestMother.createEmployeeRequest({
          vehicles: [vehicle]
        });
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id],
          employee
        });

        const response = await sendRequest(requestData, 400);

        expect(response.body).toHaveProperty(
          'message',
          'You cannot add or deletes vehicles identified to a new employee.'
        );
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(0);
        expect(employees).toHaveLength(0);
        expect(vehicles).toHaveLength(0);
      });

      it('Datos de empleado y vehículo enviados son actualizados si ya existen en base de datos', async () => {
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withAvailableStatus()
          .withTypeSingle()
          .build(location.id);
        const tag = await new TagBuilder().build();
        const employee = await new EmployeeBuilder().build();
        const vehicle = await new VehicleBuilder().build(employee.id);

        const employeeRequest = AssignmentRequestMother.createEmployeeRequest({
          id: employee.id,
          employeeCode: employee.employeeCode
        });
        const vehicleRequest = AssignmentRequestMother.createVehicleRequest({
          id: vehicle.id
        });
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [tag.id],
          employee: { ...employeeRequest, vehicles: [vehicleRequest] }
        });

        const response = await sendRequest(requestData, 201);

        expect(response.body).toEqual({ message: 'Assignment created' });
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(1);
        expect(employees).toHaveLength(1);
        expect(vehicles).toHaveLength(1);
        expect(employees[0]).toMatchObject({
          name: requestData.employee!.name,
          workplace: requestData.employee!.workplace,
          identifierDocument: requestData.employee!.identifierDocument,
          company: requestData.employee!.company,
          department: requestData.employee!.department,
          subManagement: requestData.employee!.subManagement,
          management1: requestData.employee!.management1,
          management2: requestData.employee!.management2,
          workSite: requestData.employee!.workSite,
          address: requestData.employee!.address,
          email: requestData.employee!.email,
          phone: requestData.employee!.phone
        });
        expect(vehicles[0]).toMatchObject({
          vehicleBadge: requestData.employee!.vehicles![0].vehicleBadge,
          color: requestData.employee!.vehicles![0].color,
          brand: requestData.employee!.vehicles![0].brand,
          model: requestData.employee!.vehicles![0].model,
          type: requestData.employee!.vehicles![0].type
        });
      });

      it('Etiquetas enviadas deberán existir en base de datos para continuar con la asignación', async () => {
        const location = await new LocationBuilder().withActiveStatus().build();
        const slot = await new SlotBuilder()
          .withAvailableStatus()
          .withTypeSingle()
          .build(location.id);
        const requestData = AssignmentRequestMother.createAssignmentRequest({
          slotId: slot.id,
          tags: [faker.string.uuid()]
        });

        const response = await sendRequest(requestData, 400);

        expect(response.body).toHaveProperty(
          'message',
          'Tags are not valid or not exist'
        );
        const assignments = await AssignmentHelper.getAllAssignments();
        const employees = await AssignmentHelper.getAllEmployees();
        const vehicles = await AssignmentHelper.getAllVehicles();
        expect(assignments).toHaveLength(0);
        expect(employees).toHaveLength(0);
        expect(vehicles).toHaveLength(0);
      });

      it.skip('No se puede crear asignación a un empleado con asignación temporal activa', async () => {});
    });

    describe('GET', () => {
      const sendRequest = async (
        statusCodeExpected: number,
        page: string | number = 1,
        limit: string | number = 20,
        locationId?: string
      ) => {
        return await request(server.getApp())
          .get(
            locationId
              ? `${baseUrl}/${locationId}`
              : `${baseUrl}?limit=${limit}&page=${page}`
          )
          .expect(statusCodeExpected)
          .expect('Content-Type', /json/);
      };

      it('Se devuelve objeto con un array de asignaciones y un contador de páginas', async () => {
        const assignment1 = await new AssignmentBuilder().buildWithActiveStatus(
          faker.helpers.arrayElement([
            AssignmentStatus.ASSIGNED,
            AssignmentStatus.IN_PROGRESS,
            AssignmentStatus.ACCEPTED
          ])
        );
        const assignment2 =
          await new AssignmentBuilder().buildWithCancelledOrRejectStatus(
            faker.helpers.arrayElement([
              AssignmentStatus.CANCELLED,
              AssignmentStatus.REJECTED
            ]),
            '2024-01-01'
          );
        const assignment3 =
          await new AssignmentBuilder().buildWithDeAssignedStatus(
            faker.helpers.arrayElement([
              AssignmentStatus.MANUAL_DE_ASSIGNMENT,
              AssignmentStatus.AUTO_DE_ASSIGNMENT
            ])
          );

        const response = await sendRequest(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data).toHaveLength(3);
        expect(response.body.pageCounter).toBe(1);

        const matchObject = (data: any, assignment: any) => {
          expect(data.id).toBe(assignment.id);
          expect(data.parkingCardNumber).toBe(assignment.parkingCardNumber);
          expect(data.benefitType).toBe(assignment.benefitType);
          expect(data.status).toBe(assignment.status);
        };

        matchObject(
          response.body.data.find((a: any) => a.id === assignment1.id),
          assignment1
        );
        matchObject(
          response.body.data.find((a: any) => a.id === assignment2.id),
          assignment2
        );
        matchObject(
          response.body.data.find((a: any) => a.id === assignment3.id),
          assignment3
        );
      });

      it('La estructura del arreglo es correcta', async () => {
        const assignment = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.ASSIGNED,
          '2024-01-01'
        );
        const response = await sendRequest(200);

        expect(response.body.data[0]).toMatchObject({
          id: assignment.id,
          parkingCardNumber: assignment.parkingCardNumber,
          benefitType: assignment.benefitType,
          status: assignment.status,
          assignmentDate: '',
          formDecisionDate: '',
          employee: expect.any(Object),
          location: expect.any(Object)
        });
      });

      it('Al envíar una página fuera del rango de páginas existentes el arreglo de asignaciones se devuelve vacío', async () => {
        const response = await sendRequest(200, 10, 1);

        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data).toHaveLength(0);
        expect(response.body.pageCounter).toBe(0);
      });

      it('No se permite intentar consultar más de 100 registros por página', async () => {
        const response = await sendRequest(400, 1, 101);

        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Number must be less than or equal to 100'
        );
      });

      it('Se valida que para consumir el endpoint se debe enviar limit y page como parámetros y deben ser válidos en su contexto', async () => {
        const response1 = await sendRequest(400, 'abc', 1);
        const response2 = await sendRequest(400, -1, 1);
        const response3 = await sendRequest(400, 1, 'abc');
        const response4 = await sendRequest(400, 1, -1);

        Array.of(response1, response3).forEach(res =>
          expect(res.body.message[0]).toHaveProperty(
            'message',
            'Expected number, received nan'
          )
        );

        Array.of(response2, response4).forEach(res =>
          expect(res.body.message[0]).toHaveProperty(
            'message',
            'Number must be greater than or equal to 1'
          )
        );
      });

      it('Se devuelve información de asignación según ID solicitado', async () => {
        const assignment = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.ACCEPTED,
          '2024-01-01'
        );
        const response = await sendRequest(200, 1, 1, assignment.id);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toBeInstanceOf(Object);
        expect(response.body.data).toMatchObject({
          id: assignment.id,
          parkingCardNumber: assignment.parkingCardNumber,
          benefitType: assignment.benefitType,
          status: assignment.status,
          assignmentDate: '',
          formDecisionDate: assignment.formDecisionDate,
          employee: expect.any(Object),
          location: expect.any(Object),
          tags: expect.any(Array)
        });
      });

      it.skip('Si una asignación ha sido dada de baja se devuelve fecha de baja', async () => {});

      it('Al envíar ID de asignación no existente se informa de que no existe la asignación', async () => {
        const response = await sendRequest(404, 1, 1, faker.string.uuid());
        expect(response.body).toHaveProperty('message', 'Assignment not found');
      });

      it('Se valida que ID de asignación tenga formato UUID', async () => {
        const response = await sendRequest(400, 1, 1, 'abc');
        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Invalid uuid'
        );
      });
    });
  });

  describe('Acceptance Forms', () => {
    describe('POST', () => {
      const sendRequest = async (
        locationId: string,
        requestData: any,
        statusCodeExpected: number
      ) => {
        return await request(server.getApp())
          .post(`${baseUrl}/acceptance/${locationId}`)
          .send(requestData)
          .expect(statusCodeExpected)
          .expect('Content-Type', /json/);
      };

      it('El id de la asignación enviada debe existir como asignación activa', async () => {
        const requestData =
          AcceptanceFormRequestMother.createAcceptanceFormRequest();

        const response = await sendRequest(
          faker.string.uuid(),
          requestData,
          404
        );

        expect(response.body).toHaveProperty('message', 'Assignment not found');
      });

      it('Se valida que el id de la asignación tenga formato UUID', async () => {
        const requestData =
          AcceptanceFormRequestMother.createAcceptanceFormRequest();

        const response = await sendRequest('abc', requestData, 400);

        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Invalid uuid'
        );
      });

      it('Se valida estructura de datos enviados en petición', async () => {
        const response = await sendRequest(faker.string.uuid(), {}, 400);

        expect(response.body.message[0]).toHaveProperty('path', [
          'headEmployeeData'
        ]);
      });

      it('Solo se puede crear formulario de aceptación cuando una asignación está en "ASIGNADO" o "EN_PROGRESO"', async () => {
        const assignment1 = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.ACCEPTED
        );
        const assignment2 =
          await new AssignmentBuilder().buildWithCancelledOrRejectStatus(
            AssignmentStatus.CANCELLED,
            '2024-01-01'
          );
        const assignment3 =
          await new AssignmentBuilder().buildWithDeAssignedStatus(
            AssignmentStatus.MANUAL_DE_ASSIGNMENT
          );
        const requestData =
          AcceptanceFormRequestMother.createAcceptanceFormRequest();

        const response1 = await sendRequest(assignment1.id, requestData, 400);
        const response2 = await sendRequest(assignment2.id, requestData, 400);
        const response3 = await sendRequest(assignment3.id, requestData, 400);

        expect(response1.body).toHaveProperty(
          'message',
          'The assignment is not valid, please check the status of the assignment'
        );
        expect(response2.body).toHaveProperty(
          'message',
          'The assignment is not valid, please check the status of the assignment'
        );
        expect(response3.body).toHaveProperty(
          'message',
          'The assignment is not valid, please check the status of the assignment'
        );
      });

      it('Al crear el formulario cambiar el estado de la asignación a "EN_PROGRESO"', async () => {
        await new SettingBuilder()
          .withSettingSignaturesForAcceptanceForm()
          .build();
        const assigment = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.ASSIGNED
        );
        const requestData =
          AcceptanceFormRequestMother.createAcceptanceFormRequest();

        const response = await sendRequest(assigment.id, requestData, 200);

        expect(response.body).toHaveProperty(
          'message',
          'The assignment is being processed'
        );
        const assignmentsDatabase = await AssignmentHelper.getAllAssignments();
        expect(assignmentsDatabase[0].status).toBe(
          AssignmentStatus.IN_PROGRESS
        );
      });

      it('Se puede utilizar endpoint N veces si está en estado "EN_PROGRESO"', async () => {
        await new SettingBuilder()
          .withSettingSignaturesForAcceptanceForm()
          .build();
        const assignment = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.ASSIGNED
        );
        const requestData =
          AcceptanceFormRequestMother.createAcceptanceFormRequest();

        const response = await sendRequest(assignment.id, requestData, 200);

        for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
          const response = await sendRequest(assignment.id, requestData, 200);
          expect(response.body).toHaveProperty(
            'message',
            'The assignment is being processed'
          );
        }

        expect(response.body).toHaveProperty(
          'message',
          'The assignment is being processed'
        );
      });
    });

    describe('PATCH', () => {
      const sendRequest = async (
        locationId: string,
        requestData: any,
        statusCodeExpected: number
      ) => {
        return await request(server.getApp())
          .patch(`${baseUrl}/acceptance/${locationId}`)
          .send(requestData)
          .expect(statusCodeExpected)
          .expect('Content-Type', /json/);
      };

      it('Cambio de estado a asignación según el tipo enviado', async () => {
        const assingment1 = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.IN_PROGRESS
        );
        const assingment2 = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.IN_PROGRESS
        );
        const assingment3 = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.IN_PROGRESS
        );

        const dataRequest1 = { status: 'ACEPTADO' };
        const dataRequest2 = { status: 'RECHAZADO' };
        const dataRequest3 = { status: 'CANCELADO' };

        const response = await sendRequest(assingment1.id, dataRequest1, 200);
        const response2 = await sendRequest(assingment2.id, dataRequest2, 200);
        const response3 = await sendRequest(assingment3.id, dataRequest3, 200);

        Array.of(response, response2, response3).forEach(res =>
          expect(res.body).toHaveProperty(
            'message',
            'Status of assignment updated'
          )
        );

        const assignmentsDatabase = await AssignmentHelper.getAllAssignments();
        expect(
          assignmentsDatabase.some(
            ass => ass.status === AssignmentStatus.IN_PROGRESS
          )
        ).toBeFalsy();
      });

      it('No se puede actualizar estado si no está en "EN_PROGRESO"', async () => {
        const assignment1 =
          await new AssignmentBuilder().buildWithCancelledOrRejectStatus(
            faker.helpers.arrayElement([
              AssignmentStatus.CANCELLED,
              AssignmentStatus.REJECTED
            ]),
            '2024-01-01'
          );
        const assignment2 =
          await new AssignmentBuilder().buildWithDeAssignedStatus(
            faker.helpers.arrayElement([
              AssignmentStatus.MANUAL_DE_ASSIGNMENT,
              AssignmentStatus.AUTO_DE_ASSIGNMENT
            ])
          );
        const requestData = { status: 'ACEPTADO' };

        const response = await sendRequest(assignment1.id, requestData, 400);
        const response2 = await sendRequest(assignment2.id, requestData, 400);

        Array.of(response, response2).forEach(res =>
          expect(res.body).toHaveProperty(
            'message',
            'The assignment is not in progress of acceptance'
          )
        );
        const assignmentsDatabase = await AssignmentHelper.getAllAssignments();
        expect(
          assignmentsDatabase.filter(ass => ass.id === assignment1.id)[0]
        ).toMatchObject({
          status: assignment1.status
        });
        expect(
          assignmentsDatabase.filter(ass => ass.id === assignment2.id)[0]
        ).toMatchObject({
          status: assignment2.status
        });
      });

      it('La asignación enviada debe existir en base de datos', async () => {
        const requestData = {
          status: 'ACEPTADO'
        };

        const response = await sendRequest(
          faker.string.uuid(),
          requestData,
          404
        );

        expect(response.body).toHaveProperty('message', 'Assignment not found');
      });

      it('Se valida que el id de la asignación tenga formato UUID', async () => {
        const requestData = {
          status: 'ACEPTADO'
        };

        const response = await sendRequest('abc', requestData, 400);

        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Invalid uuid'
        );
      });

      it('Se valida que petición enviada tenga estructura y datos permitidos y válidos', async () => {
        const response = await sendRequest(faker.string.uuid(), {}, 400);

        expect(response.body.message[0]).toHaveProperty('path', ['status']);
      });
    });

    describe('GET', () => {
      const sendRequest = async (
        locationId: string,
        requestData: any,
        statusCodeExpected: number
      ) => {
        return await request(server.getApp())
          .get(`${baseUrl}/acceptance/${locationId}/data`)
          .send(requestData)
          .expect(statusCodeExpected)
          .expect('Content-Type', /json/);
      };

      it('Se devuelve información de empleado actual, empleado anterior y datos para firma de asignación solicitada', async () => {
        const assignment = await new AssignmentBuilder().buildWithActiveStatus(
          faker.helpers.arrayElement([
            AssignmentStatus.ASSIGNED,
            AssignmentStatus.IN_PROGRESS
          ])
        );
        await new SettingBuilder()
          .withSettingSignaturesForAcceptanceForm()
          .build();

        const response = await sendRequest(assignment.id, {}, 200);

        expect({
          ...response.body,
          data: {
            ...response.body.data,
            signatures: JSON.parse(response.body.data.signatures)
          }
        }).toMatchObject({
          data: {
            assignmentId: assignment.id,
            parkingCardNumber: assignment.parkingCardNumber,
            benefitType: assignment.benefitType,
            employee: expect.objectContaining({
              employeeCode: assignment.employee.employeeCode,
              name: assignment.employee.name
            }),
            previousEmployee: null,
            signatures: {
              security_boss: expect.any(Object),
              parking_manager: expect.any(Object),
              human_resources_manager: expect.any(Object),
              human_resources_payroll: expect.any(Object)
            }
          }
        });
      });

      it('No devuelve información a partir de Id de asignación no existente', async () => {
        const response = await sendRequest(faker.string.uuid(), {}, 404);

        expect(response.body).toHaveProperty('message', 'Assignment not found');
      });

      it('Se valida que ID de asignación tenga formato UUID', async () => {
        const response = await sendRequest('abc', {}, 400);

        expect(response.body.message[0]).toHaveProperty(
          'message',
          'Invalid uuid'
        );
      });

      it('Solo si la asignación tiene estado "EN_PROGRESO" o "ASIGNADO" se puede obtener información', async () => {
        const assignment1 =
          await new AssignmentBuilder().buildWithCancelledOrRejectStatus(
            faker.helpers.arrayElement([
              AssignmentStatus.CANCELLED,
              AssignmentStatus.REJECTED
            ]),
            '2024-01-01'
          );
        const assignment2 =
          await new AssignmentBuilder().buildWithDeAssignedStatus(
            faker.helpers.arrayElement([
              AssignmentStatus.MANUAL_DE_ASSIGNMENT,
              AssignmentStatus.AUTO_DE_ASSIGNMENT
            ])
          );
        const assignment3 = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.ACCEPTED
        );

        const response = await sendRequest(assignment1.id, {}, 400);
        const response2 = await sendRequest(assignment2.id, {}, 400);
        const response3 = await sendRequest(assignment3.id, {}, 400);

        Array.of(response, response2, response3).forEach(res =>
          expect(res.body).toHaveProperty(
            'message',
            'The assignment is not valid, please check the status of the assignment'
          )
        );
      });

      it('Si no hay información de firmantes se rechaza la petición', async () => {
        const assignment = await new AssignmentBuilder().buildWithActiveStatus(
          AssignmentStatus.ASSIGNED
        );
        await ParametersHelper.deleteAllSettings();

        const response = await sendRequest(assignment.id, {}, 400);

        expect(response.body).toHaveProperty(
          'message',
          'Data signatures for acceptance form not found'
        );
      });

      it.skip('Se recuperación información de empleado que anteriormente ocupada espacio', async () => {});
    });
  });
});

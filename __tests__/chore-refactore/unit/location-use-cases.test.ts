import { mockLocationRepository } from "../__mocks__/location-mocks";
import { CreateLocation } from '../../src/location/application/user-cases/create-location';
import { CostType, SlotStatus, VehicleType } from "../../src/location/core/entities/slot-entity";
import { SlotType } from "../../src/location/core/entities/slot-entity";
import { LocationMother } from '../mother/location-mother';
import { UpdateLocation } from '../../src/location/application/user-cases/update-location';
import { ValidationsUseCases } from "../../src/location/application/user-cases/validations";
import { LocationEntity, LocationStatus } from "../../src/location/core/entities/location-entity";

describe('LOCATION: Use Cases', () => {

  let createLocationUseCase: CreateLocation;
  let updateLocationUseCase: UpdateLocation;
  let locationData: any;
  let slotsData: any[];
  let validations: ValidationsUseCases;

  const setupTest = () => {
    jest.clearAllMocks();
    locationData = LocationMother.createLocationPrimitive();
    slotsData = [LocationMother.createSlotPrimitive()];
    createLocationUseCase = new CreateLocation(mockLocationRepository);
    validations = new ValidationsUseCases(mockLocationRepository);
    updateLocationUseCase = new UpdateLocation(mockLocationRepository, validations);
  };

  const runCreateLocationTest = async (data: any, expectedErrorMessage?: string) => {
    if (expectedErrorMessage) {
      await expect(createLocationUseCase.run(data)).rejects.toThrow(expectedErrorMessage);
    } else {
      await createLocationUseCase.run(data);
      expect(mockLocationRepository.createLocation).toHaveBeenCalledWith(data);
    }
  };

  const runUpdateLocationTest = async (data: any, slotsToDelete: Set<string>, expectedErrorMessage?: string) => {
    if (expectedErrorMessage) {
      await expect(updateLocationUseCase.run(data, slotsToDelete)).rejects.toThrow(expectedErrorMessage);
    } else {
      await updateLocationUseCase.run(data, slotsToDelete);
      expect(mockLocationRepository.updateLocation).toHaveBeenCalledWith(data, slotsToDelete);
    }
  };

  describe('USE_CASE: Create Location', () => {

    beforeEach(() => setupTest());

    it.each([
      { slotType: SlotType.SIMPLE, limitOfAssignments: 1 },
      { slotType: SlotType.MULTIPLE, limitOfAssignments: 2 }
    ])('should create a new location TYPE $slotType', async ({ slotType, limitOfAssignments }) => {
      slotsData[0].slotType = slotType;
      slotsData[0].limitOfAssignments = limitOfAssignments;
      await runCreateLocationTest({ ...locationData, slots: slotsData });
    });

    it('should create a new location with TYPE_COST, COMPLEMENT or DISCOUNT', async () => {
      slotsData[0].costType = CostType.COMPLEMENT;
      slotsData[0].cost = 10;
      await runCreateLocationTest({ ...locationData, slots: slotsData });

      slotsData[0].costType = CostType.DISCOUNT;
      slotsData[0].cost = 20;
      await runCreateLocationTest({ ...locationData, slots: slotsData });
    });

    it.each([
      { slotType: SlotType.SIMPLE, limitOfAssignments: 2, errorMessage: 'The number of schedules cannot be greater than 1 or less than 1 for SIMPLE type spaces.' },
      { slotType: SlotType.SIMPLE, limitOfAssignments: -1, errorMessage: 'The number of schedules cannot be greater than 1 or less than 1 for SIMPLE type spaces.' },
      { slotType: SlotType.MULTIPLE, limitOfAssignments: 1, errorMessage: 'The number of schedules for a multiple space should be greater than 1.' },
    ])('throw an error if SLOT_TYPE is $slotType and limitOfAssignments is $limitOfAssignments', async ({ slotType, limitOfAssignments, errorMessage }) => {
      slotsData[0].slotType = slotType;
      slotsData[0].limitOfAssignments = limitOfAssignments;
      await runCreateLocationTest({ ...locationData, slots: slotsData }, errorMessage);
    });

    it.each([
      { costType: CostType.COMPLEMENT, cost: 0, errorMessage: 'You must assign a value of whether the type of space is DESCUENTO or COMPLEMENTO.' },
      { costType: CostType.DISCOUNT, cost: 0, errorMessage: 'You must assign a value of whether the type of space is DESCUENTO or COMPLEMENTO.' },
      { costType: CostType.NO_COST, cost: 1, errorMessage: 'You cannot assign a cost value if the type is SIN_COSTO.' },
      { costType: CostType.NO_COST, cost: -1, errorMessage: 'You cannot assign a cost value if the type is SIN_COSTO.' }
    ])('throw an error if COST_TYPE is $costType and cost is $cost', async ({ costType, cost, errorMessage }) => {
      slotsData[0].costType = costType;
      slotsData[0].cost = cost;
      await runCreateLocationTest({ ...locationData, slots: slotsData }, errorMessage);
    });

  });

  describe('USE_CASE: Update Location', () => {

    beforeEach(() => setupTest());

     it('should update a location', async () => {
      const data = { ...locationData, slots: slotsData };
      const locationEntity = LocationEntity.fromPrimitives(data);
      const slotsToDelete: Set<string> = new Set();
      mockLocationRepository.getLocationById.mockResolvedValueOnce(locationEntity);
      await runUpdateLocationTest(data, slotsToDelete);
    });

     it('should update number of schedules assigned to a slot', async () => {
      const requestData = { ...locationData, slots: slotsData };
      const requestSlotsToDelete: Set<string> = new Set();
      requestData.slots[0].status = SlotStatus.OCCUPIED;
      requestData.slots[0].slotType = SlotType.MULTIPLE;
      requestData.slots[0].limitOfAssignments = 3;

      const slots = [{ ...requestData.slots[0], status: SlotStatus.OCCUPIED }];
      mockLocationRepository.getLocationById.mockResolvedValueOnce(LocationEntity.fromPrimitives({ ...requestData, slots }));
      mockLocationRepository.callProcedure.mockResolvedValueOnce([{ slot_id: slots[0].id, current_number_of_assignments: 1, limit_of_assignments: 5 }]);
      await runUpdateLocationTest(requestData, requestSlotsToDelete);
    });

    it('should throw an error if location does not exist', async () => {
      const data = { ...locationData, slots: slotsData };
      const slotsToDelete: Set<string> = new Set();
      mockLocationRepository.getLocationById.mockResolvedValueOnce(null);
      await runUpdateLocationTest(data, slotsToDelete, 'Location not found');
    });

    it('should throw an error when trying to inactivate a location if any slot is occupied', async () => {
      const data = { ...locationData, slots: slotsData, status: LocationStatus.INACTIVE };
      const slotsToDelete: Set<string> = new Set();
      const locationEntity = LocationEntity.fromPrimitives({ ...data, status: LocationStatus.ACTIVE });
      mockLocationRepository.getLocationById.mockResolvedValueOnce(locationEntity);
      mockLocationRepository.executeFunction.mockResolvedValueOnce(true);
      await runUpdateLocationTest(data, slotsToDelete, 'You cannot inactivate a location with active assignments');
    });

     it('should throw an error if any slot to update or delete does not belong to the location', async () => {
      const data = { ...locationData, slots: slotsData };
      const slotsToDelete: Set<string> = new Set();
      mockLocationRepository.getLocationById.mockResolvedValueOnce(LocationEntity.fromPrimitives({ ...data, slots: [LocationMother.createSlotPrimitive()] }));
      await runUpdateLocationTest(data, slotsToDelete, `You cannot update slot with id ${data.slots[0].id} because it does not belong to location`);

      const idSlotToDelete = 'abc';
      slotsToDelete.add(idSlotToDelete);
      mockLocationRepository.getLocationById.mockResolvedValueOnce(LocationEntity.fromPrimitives(data));
      await runUpdateLocationTest(data, slotsToDelete, `You cannot delete slot with id ${idSlotToDelete} because it does not belong to location`);
    });

    it('throw an error to trying update SLOT_TYPE of a slot if it is occupied', async () => {
      const data = { ...locationData, slots: slotsData };
      const slotsToDelete: Set<string> = new Set();
      data.slots[0].status = SlotStatus.OCCUPIED;
      data.slots[0].slotType = SlotType.SIMPLE;
      data.slots[0].limitOfAssignments = 1;

      const slots = [{...data.slots[0], status: SlotStatus.ACTIVE}]
      slots[0].status = SlotStatus.OCCUPIED;
      slots[0].slotType = SlotType.MULTIPLE;
      slots[0].limitOfAssignments = 2;
      mockLocationRepository.getLocationById.mockResolvedValueOnce(LocationEntity.fromPrimitives({...data, slots }));
      await runUpdateLocationTest(data, slotsToDelete, 'You cannot update properties slotType, vehicleType, costType, status, cost if it is occupied');
    })

     it('throw an error to trying update VEHICLE_TYPE of a slot if it is occupied', async () => {
      const data = { ...locationData, slots: slotsData };
      const slotsToDelete: Set<string> = new Set();
      data.slots[0].status = SlotStatus.OCCUPIED;
      data.slots[0].vehicleType = VehicleType.CAR;

      const slots = [{...data.slots[0], status: SlotStatus.ACTIVE}]
      slots[0].status = SlotStatus.OCCUPIED;
      slots[0].vehicleType = VehicleType.CYCLE;
      mockLocationRepository.getLocationById.mockResolvedValueOnce(LocationEntity.fromPrimitives({...data, slots }));
      await runUpdateLocationTest(data, slotsToDelete, 'You cannot update properties slotType, vehicleType, costType, status, cost if it is occupied');
    })

    it('throw an error to trying update COST_TYPE of a slot if it is occupied', async () => {
      const data = { ...locationData, slots: slotsData };
      const slotsToDelete: Set<string> = new Set();
      data.slots[0].costType = CostType.COMPLEMENT;
      data.slots[0].cost = 100;

      const slots = [{...data.slots[0], status: SlotStatus.OCCUPIED}]
      slots[0].costType = CostType.NO_COST;
      slots[0].cost = 0;
      mockLocationRepository.getLocationById.mockResolvedValueOnce(LocationEntity.fromPrimitives({...data, slots }));
      await runUpdateLocationTest(data, slotsToDelete, 'You cannot update properties slotType, vehicleType, costType, status, cost if it is occupied');
    })

    it('throw and error if trying to update STATUS of a slot if it is occupied', async () => {
      const data = { ...locationData, slots: slotsData };
      const slotsToDelete: Set<string> = new Set();
      data.slots[0].status = SlotStatus.OCCUPIED;

      const slots = [{...data.slots[0], status: SlotStatus.ACTIVE}]
      mockLocationRepository.getLocationById.mockResolvedValueOnce(LocationEntity.fromPrimitives({...data, slots }));
      await runUpdateLocationTest(data, slotsToDelete, 'You cannot update properties slotType, vehicleType, costType, status, cost if it is occupied');
    })

    it('throw an error if to try update limited schedules out of number of schedules assigned', async () => {
      const data = { ...locationData, slots: slotsData };
      const slotsToDelete: Set<string> = new Set();
      data.slots[0].status = SlotStatus.OCCUPIED;
      data.slots[0].slotType = SlotType.MULTIPLE;
      data.slots[0].limitOfAssignments = 3;

      const slots = [{...data.slots[0], status: SlotStatus.OCCUPIED}]
      mockLocationRepository.getLocationById.mockResolvedValueOnce(LocationEntity.fromPrimitives({...data, slots }));
      mockLocationRepository.callProcedure.mockResolvedValueOnce([{slot_id: slots[0].id, current_number_of_assignments: 4, limit_of_assignments: 5}])
      await runUpdateLocationTest(data, slotsToDelete, `Number of schedules in slot ${slots[0].id} cannot be less than the number of schedules already assigned`);
    })

  })
});

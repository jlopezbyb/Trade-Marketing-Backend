/* eslint-disable  @typescript-eslint/no-unsafe-call */
/* eslint-disable  @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable  @typescript-eslint/no-unused-vars */

import { FindAttributeOptions } from 'sequelize';
import { Op } from 'sequelize';
import { QueryTypes } from 'sequelize';
import { Transaction } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { addDay } from '@formkit/tempo';
import { format } from '@formkit/tempo';
import { weekStart } from '@formkit/tempo';
import { addMonth } from '@formkit/tempo';

import { sequelize } from '@src/server/config/database/sequelize';

import { LocationModel } from '@src/contexts/shared/infrastructure/models/parking/location.model';
import { SlotModel } from '@src/contexts/shared/infrastructure/models/parking/slot.model';
import { subMonths, startOfMonth, endOfDay } from 'date-fns';

import {
  FunctionNames,
  LocationRepository,
  ProcedureNames,
  ResponseAvailableSlots
} from '@src/contexts/location/core/repositories/location-repository';
import { OverviewDataResult } from '@src/contexts/location/core/repositories/location-repository';
import { TrendDataResult } from '@src/contexts/location/core/repositories/location-repository';
import { TrendDataType } from '@src/contexts/location/core/repositories/location-repository';
import { LocationFinderResult } from '@src/contexts/location/core/repositories/location-repository';

import { LocationEntity } from '@src/contexts/location/core/entities/location-entity';
import { BenefitType, SlotEntity, SlotStatusEnum, SlotType, VehicleType } from '@src/contexts/location/core/entities/slot-entity';
import { SlotStatus } from '@src/contexts/location/core/entities/slot-entity';
import { ParkingTrendsModel } from '@src/contexts/shared/infrastructure/models/parking/parking-trends';
import { UUIDV4 } from 'sequelize';

export class SequelizeMYSQLLocationRepository implements LocationRepository {
  async createLocation(location: LocationEntity): Promise<void> {
    let transaction: Transaction | null = null;

    try {
      transaction = await sequelize.transaction();

      await LocationModel.create(
        {
          ...location,
          id: location.id // usa el que ya viene del use case
        },
        { transaction }
      );

      if (location.slots) {
        await SlotModel.bulkCreate(
          location.slots.map(slot => ({ ...slot, id: uuid(), locationId: location.id })),
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async updateLocation(location: LocationEntity, slotsToDelete: Set<string>): Promise<void> {
    let transaction: Transaction | null = null;
    try {
      transaction = await sequelize.transaction();
      // Update Location
      await LocationModel.update(location, {
        where: { id: location.id },
        transaction,
        fields: ['name', 'address', 'contactReference', 'phone', 'email', 'comments', 'numberOfIdentifier', 'status']
      });

      // Upsert Slots
      await Promise.all(
        location.slots.map(async slot => {
          await SlotModel.upsert(
            {
              ...slot,
              id: !slot.id ? uuid() : slot.id,
              locationId: location.id
            },
            {
              fields: [
                'id',
                'locationId',
                'slotNumber',
                'slotType',
                'limitOfAssignments',
                'vehicleType',
                'benefitType',
                'amount',
                'status'
              ],
              transaction
            }
          );
        })
      );

      if (slotsToDelete.size > 0) {
        try {
          await SlotModel.destroy({
            where: {
              id: { [Op.in]: Array.from(slotsToDelete.values()) },
              location_id: location.id
            },
            transaction
          });
        } catch (error) {
          await transaction.rollback();
          throw error;
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async deleteLocation(id: string): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await LocationModel.destroy({ where: { id } });
      await SlotModel.destroy({ where: { locationId: id }, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction?.rollback();
      throw error;
    }
  }

  async getLocationById(id: string): Promise<LocationEntity | null> {
    const locationDatabase = await LocationModel.findByPk(id, {
      include: {
        model: SlotModel
      }
    });

    if (!locationDatabase) return null;

    return LocationEntity.fromPrimitives({
      ...locationDatabase.get({ plain: true })
    });
  }

  async getLocations(limit: number = 20, page: number = 1): Promise<LocationFinderResult | null> {
    const locationsCounter = await LocationModel.count();
    const allPages = Math.ceil(locationsCounter / limit);
    const offset = (page - 1) * limit;

    const locationsDatabase = await LocationModel.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          model: SlotModel,
          as: 'slots',
          attributes: ['status']
        }
      ],
      limit,
      offset
    });

    const locations = locationsDatabase.map((location: LocationModel) => {
      const locationTmp = location.get({ plain: true });
      const slots = locationTmp.slots || [];

      const totalSlots = slots.length;

      let availableSlots = 0;
      let unavailableSlots = 0;
      let occupiedSlots = 0;

      slots.forEach((slot: { status: string }) => {
        const normalizedStatus = slot.status?.toUpperCase().trim();

        switch (normalizedStatus) {
          case SlotStatusEnum.ACTIVE:
            availableSlots++;
            break;
          case SlotStatusEnum.INACTIVE:
            unavailableSlots++;
            break;
          case SlotStatusEnum.OCCUPIED:
            occupiedSlots++;
            break;
          default:
            console.warn(`Estado de slot no reconocido: ${slot.status}`);
        }
      });

      return {
        id: locationTmp.id,
        name: locationTmp.name,
        address: locationTmp.address,
        contactReference: locationTmp.contactReference,
        phone: locationTmp.phone,
        email: locationTmp.email,
        comments: locationTmp.comments,
        numberOfIdentifier: locationTmp.numberOfIdentifier,
        status: locationTmp.status,
        totalSlots,
        availableSlots,
        unavailableSlots,
        occupiedSlots
      };
    });
    return { data: locations, pageCounter: allPages };
  }

  async getSlotById(id: string): Promise<SlotEntity | null> {
    const slotDatabase = await SlotModel.findByPk(id);

    if (!slotDatabase) return null;

    return SlotEntity.fromPrimitives(slotDatabase.get({ plain: true }));
    //return slotDatabase?.get({ plain: true }) as SlotEntity;
  }

  async getLocationBySlotId(slotId: string): Promise<LocationEntity | null> {
    const location = await LocationModel.findOne({
      include: [
        {
          model: SlotModel,
          as: 'slots',
          where: { id: slotId }
        }
      ]
    });

    if (!location) return null;

    return LocationEntity.fromPrimitives({
      ...location.get({ plain: true })
    });
  }

  async executeFunction<TypeFunctionResult = boolean | number>(
    functionName: FunctionNames,
    params: string[]
  ): Promise<TypeFunctionResult> {
    const paramPlaceholders = params.map((_, index) => `:param${index}`).join(',');
    const query = `SELECT ${functionName}(${paramPlaceholders})`;

    const paramReplacements = params.reduce(
      (acc, param, index) => {
        acc[`param${index}`] = param;
        return acc;
      },
      {} as Record<string, string>
    );

    const [resultFunction]: {
      [key: string]: boolean;
    }[] = await sequelize.query(query, {
      replacements: paramReplacements,
      type: QueryTypes.SELECT
    });

    return Object.values(resultFunction)[0] as TypeFunctionResult;
  }

  async callProcedure<TypeProcedureResult>(procedureName: ProcedureNames, params: string[]): Promise<TypeProcedureResult> {
    const paramPlaceholders = params.map((_, index) => `:param${index}`).join(',');
    const query = `call ${procedureName}(${paramPlaceholders})`;

    const paramReplacements = params.reduce(
      (acc, param, index) => {
        acc[`param${index}`] = param;
        return acc;
      },
      {} as Record<string, string>
    );

    const [result] = await sequelize.query(query, {
      replacements: paramReplacements,
      type: QueryTypes.SELECT
    });

    return Object.values(result) as TypeProcedureResult;
  }

  async overviewData(): Promise<OverviewDataResult> {
    const [result]: {
      total_slots: number;
      available_slots: number;
      unavailable_slots: number;
      occupied_slots: number;
    }[] = await sequelize.query(
      `
      select
      sum(total_slots) as total_slots,
      sum(available_slots) as available_slots,
      sum(unavailable_slots) as unavailable_slots,
      sum(occupied_slots) as occupied_slots
      from location_slot_summary
      `,
      {
        type: QueryTypes.SELECT
      }
    );

    return {
      totalSlots: Number(result.total_slots),
      availableSlots: Number(result.available_slots),
      unavailableSlots: Number(result.unavailable_slots),
      occupiedSlots: Number(result.occupied_slots)
    };
  }

  async trendData(type: TrendDataType): Promise<TrendDataResult[] | []> {
    const today = new Date();
    let dateRange: { startDate: string; endDate: string } = {
      startDate: '',
      endDate: ''
    };
    let groupBy: string = '';
    let attributes: FindAttributeOptions | string = [];

    const baseAttributes: FindAttributeOptions | string = [
      [sequelize.fn('SUM', sequelize.col('total_slots')), 'totalSlots'],
      [sequelize.fn('SUM', sequelize.col('available_slots')), 'availableSlots'],
      [sequelize.fn('SUM', sequelize.col('unavailable_slots')), 'unavailableSlots'],
      [sequelize.fn('SUM', sequelize.col('occupied_slots')), 'occupiedSlots']
    ];

    if (type === 'daily') {
      dateRange = {
        startDate: format(addDay(today, -7), 'YYYY-MM-DD', 'en'),
        endDate: format(today, 'YYYY-MM-DD', 'en')
      };
      attributes = [[sequelize.fn('DATE', sequelize.col('date')), 'periodTrend']];
      groupBy = 'periodTrend';
    }

    if (type === 'weekly') {
      dateRange = {
        startDate: format(weekStart(addDay(today, -28), 1), 'YYYY-MM-DD', 'en'),
        endDate: format(today, 'YYYY-MM-DD', 'en')
      };
      attributes = [
        [sequelize.fn('WEEK', sequelize.col('date')), 'periodTrend'],
        [sequelize.fn('MIN', sequelize.col('date')), 'startDate']
      ];
      groupBy = 'periodTrend';
    }

    if (type === 'monthly') {
      dateRange = {
        startDate: format(addMonth(today, -12), 'YYYY-MM-DD', 'en'),
        endDate: format(today, 'YYYY-MM-DD', 'en')
      };
      attributes = [[sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'periodTrend']];
      groupBy = 'periodTrend';
    }

    attributes.push(...baseAttributes);

    const trendsDatabase = await ParkingTrendsModel.findAll({
      attributes,
      where: {
        date: { [Op.between]: [dateRange.startDate, dateRange.endDate] }
      },
      group: [groupBy]
    });

    if (trendsDatabase.length === 0) return [];

    let trend;

    return trendsDatabase.map(data => {
      trend = data.get({ plain: true });
      return {
        periodTrend: trend.periodTrend,
        startDate: trend.startDate,
        totalSlots: trend.totalSlots,
        availableSlots: trend.availableSlots,
        unavailableSlots: trend.unavailableSlots,
        occupiedSlots: trend.occupiedSlots
      };
    });
  }

  async getAvailableSlotsByTypeVehicleAndLocationId(
    locationId: string,
    vehicleType: VehicleType
  ): Promise<ResponseAvailableSlots[]> {
    const query = `
 SELECT id, slot_number, slot_type, benefit_type
FROM slot
WHERE location_id = :locationId
  AND UPPER(vehicle_type) = UPPER(:vehicleType)
  AND deleted_at IS NULL
  AND (
    (slot_type = 'MULTIPLE' AND status IN ('DISPONIBLE', 'OCUPADO')
        AND get_active_assignments_by_slot(id) < slot.limit_of_assignments)
    OR (slot_type <> 'MULTIPLE' AND status = 'DISPONIBLE')
  );

  `;

    const result = await sequelize.query<{
      id: string;
      slot_number: string;
      slot_type: SlotType;
      benefit_type: string;
    }>(query, {
      replacements: { locationId, vehicleType },
      type: QueryTypes.SELECT
    });

    return result.map<ResponseAvailableSlots>(slot => ({
      id: slot.id,
      slotNumber: slot.slot_number,
      slotType: slot.slot_type,
      benefitType: slot.benefit_type
    }));
  }

  async getEmployeesParkingData(): Promise<{ months: string[]; employees: number[]; slots: number[] }> {
    const today = new Date();
    const startDate = format(addMonth(today, -12), 'YYYY-MM-DD', 'en');
    const endDate = format(today, 'YYYY-MM-DD', 'en');

    const result = await sequelize.query(
      `
    SELECT
      DATE_FORMAT(a.created_at, '%Y-%m') AS month,
      COUNT(DISTINCT a.employee_id) AS employees,
      (
        SELECT COUNT(*) FROM slot s
        WHERE s.created_at <= LAST_DAY(a.created_at)
          AND s.deleted_at IS NULL
      ) AS slots
    FROM assignment a
    WHERE a.created_at BETWEEN :startDate AND :endDate
    GROUP BY month
    ORDER BY month;
    `,
      {
        type: QueryTypes.SELECT,
        replacements: { startDate, endDate }
      }
    );

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      months: result.map((row: any) => row.month),
      employees: result.map((row: any) => Number(row.employees)),
      slots: result.map((row: any) => Number(row.slots))
    };
  }

  async getParkingAvailabilityData(): Promise<{ months: string[]; occupied: number[]; available: number[] }> {
    const now = new Date();
    // Pasa Date nativos, NO strings
    const startDate = startOfMonth(subMonths(now, 12));
    const endDate = endOfDay(now);

    const sql = `
  WITH RECURSIVE months AS (
    -- Primer día del mes hace 12 meses (tipo DATE)
    SELECT DATE_SUB(
             DATE_ADD(DATE(CAST(:endDate AS DATETIME)), INTERVAL -DAY(DATE(CAST(:endDate AS DATETIME))) + 1 DAY),
             INTERVAL 12 MONTH
           ) AS month_start
    UNION ALL
    SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
    FROM months
    WHERE month_start < DATE_ADD(DATE(CAST(:endDate AS DATETIME)), INTERVAL -DAY(DATE(CAST(:endDate AS DATETIME))) + 1 DAY)
  ),
  agg AS (
    SELECT
      -- Normaliza cada fila al primer día de su mes (tipo DATE)
      DATE_ADD(DATE(s.updated_at), INTERVAL -DAY(s.updated_at) + 1 DAY) AS month_start,
      SUM(CASE WHEN UPPER(s.status) = 'OCUPADO' THEN 1 ELSE 0 END)    AS occupied,
      SUM(CASE WHEN UPPER(s.status) = 'DISPONIBLE' THEN 1 ELSE 0 END) AS available
    FROM slot s
    WHERE s.updated_at BETWEEN CAST(:startDate AS DATETIME) AND CAST(:endDate AS DATETIME)
      AND s.deleted_at IS NULL
    GROUP BY month_start
  )
  SELECT
    DATE_FORMAT(m.month_start, '%Y-%m') AS month,
    COALESCE(a.occupied, 0)  AS occupied,
    COALESCE(a.available, 0) AS available
  FROM months m
  LEFT JOIN agg a USING (month_start)
  ORDER BY month;
  `;

    const result = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
      // Pasa Date nativos: Sequelize los envía como DATETIME
      replacements: { startDate, endDate }
    });

    const rows = result as Array<{ month: string; occupied: number; available: number }>;
    return {
      months: rows.map(r => r.month),
      occupied: rows.map(r => Number(r.occupied)),
      available: rows.map(r => Number(r.available))
    };
  }
}

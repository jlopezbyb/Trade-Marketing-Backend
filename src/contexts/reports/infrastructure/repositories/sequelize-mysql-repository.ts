//import { AssignmentModel } from '@src/contexts/shared/infrastructure/models/assignment/assignment.model';
import { DeAssignmentModel } from '@src/contexts/shared/infrastructure/models/assignment/de-assignment.model';
import { EmployeeModel } from '@src/contexts/shared/infrastructure/models/assignment/employee.model';
import { LocationModel } from '@src/contexts/shared/infrastructure/models/parking/location.model';
import { SlotModel } from '@src/contexts/shared/infrastructure/models/parking/slot.model';
import { Op, Sequelize } from 'sequelize';
import { LocationReport } from '../../core/repositories/reports-repository';

export class SequelizeMYSQLReportsRepository {
  async fetchReportByLocation(limit: number, page: number) {
    try {
      const result = await LocationModel.findAll({
        attributes: [
          ['name', 'parkingName'],
          'numberOfIdentifier',
          [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN `slots`.`benefit_type` = 'SIN_COSTO' THEN 1 ELSE 0 END")), 'noCost'],
          [
            Sequelize.fn('SUM', Sequelize.literal("CASE WHEN `slots`.`benefit_type` = 'COMPLEMENTO' THEN 1 ELSE 0 END")),
            'reimbursement'
          ],
          [
            Sequelize.fn('SUM', Sequelize.literal("CASE WHEN `slots`.`benefit_type` = 'DESCUENTO' THEN 1 ELSE 0 END")),
            'discount'
          ],
          [
            Sequelize.fn('SUM', Sequelize.literal("CASE WHEN `slots`.`vehicle_type` = 'CARRO' THEN 1 ELSE 0 END")),
            'vehicleCount'
          ],
          [
            Sequelize.fn('SUM', Sequelize.literal("CASE WHEN `slots`.`vehicle_type` = 'MOTO' THEN 1 ELSE 0 END")),
            'motorcycleCount'
          ],
          [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN `slots`.`vehicle_type` = 'CAMION' THEN 1 ELSE 0 END")), 'truckCount'],
          [Sequelize.fn('COUNT', Sequelize.col('slots.id')), 'totalSpaces'],
          [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN `slots`.`status` = 'OCUPADO' THEN 1 ELSE 0 END")), 'occupiedSpaces'],
          [
            Sequelize.fn('SUM', Sequelize.literal("CASE WHEN `slots`.`status` = 'DISPONIBLE' THEN 1 ELSE 0 END")),
            'availableSpaces'
          ],
          [
            Sequelize.literal(
              "ROUND(SUM(CASE WHEN `slots`.`status` = 'OCUPADO' THEN 1 ELSE 0 END) / COUNT(`slots`.`id`) * 100, 2)"
            ),
            'occupancyRate'
          ]
        ],
        include: [
          {
            model: SlotModel,
            where: {
              status: { [Op.ne]: 'INACTIVO' }
            },
            required: false,
            attributes: []
          }
        ],
        where: {
          status: 'ACTIVO'
        },
        group: ['location.id'],
        subQuery: false,
        limit: limit,
        offset: (page - 1) * limit
      });
      return result.map((location): LocationReport => location.get({ plain: true }) as LocationReport);
    } catch (error) {
      console.error('Error fetching report by location:', error);
      throw error;
    }
  }

  async countReportByLocation() {
    try {
      const result = await LocationModel.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('slots.id')), 'slotCount']],
        include: [
          {
            model: SlotModel,
            where: {
              status: { [Op.ne]: 'INACTIVO' }
            },
            required: false, // Ensures that we don't exclude locations without slots
            attributes: []
          }
        ],
        where: {
          status: 'ACTIVO'
        },
        group: ['location.id'],
        raw: true
      });

      // Return the count of locations with active slots
      return result.length; // Count the number of rows returned (each row represents a location with slots)
    } catch (error) {
      console.error('Error counting report by location:', error);
      throw error;
    }
  }

  async fetchReportByCollaborator({ limit, page }: { limit: number; page: number }) {
    try {
      // Fetching the report with correct pagination
      const report = await EmployeeModel.findAll({
        attributes: [
          ['employee_code', 'employeeCode'],
          ['name', 'employeeName'],
          ['workplace', 'position'],
          ['department', 'department'],
          ['sub_management', 'subManagement'],
          ['management1', 'management1'],
          ['management2', 'management2'],
          ['address', 'address'],
          ['work_site', 'work_site']
        ],
        include: [
          {
            //model: AssignmentModel,
            attributes: [['assignment_date', 'assignmentDate']],
            required: true, // Ensure inner join for AssignmentModel
            include: [
              {
                model: SlotModel,
                attributes: [['benefit_type', 'benefitType']],
                required: true,
                include: [
                  {
                    model: LocationModel,
                    attributes: [['name', 'parkingName']],
                    required: true // Ensure inner join for LocationModel
                  }
                ]
              },
              {
                model: DeAssignmentModel,
                attributes: [['de_assignment_date', 'endDate']],
                required: false // Use `required: false` for left join (to allow NULL values)
              }
            ],
            where: {
              assignment_date: { [Op.ne]: null }
            }
          }
        ],
        limit,
        offset: (page - 1) * limit
      });

      // Return the fetched report
      return report;
    } catch (error) {
      console.error('Error fetching report by collaborator:', error);
      throw error;
    }
  }

  async countReportByCollaborator() {
    try {
      // Counting the number of records based on the conditions
      const count = await EmployeeModel.count({
        include: [
          {
            //model: AssignmentModel,
            required: true, // Ensure inner join for AssignmentModel
            include: [
              {
                model: SlotModel,
                required: true,
                include: [
                  {
                    model: LocationModel,
                    required: true // Ensure inner join for LocationModel
                  }
                ]
              },
              {
                model: DeAssignmentModel,
                required: false // Use `required: false` for left join (to allow NULL values)
              }
            ],
            where: {
              assignment_date: { [Op.ne]: null }
            }
          }
        ]
      });

      // Return the total count
      return count;
    } catch (error) {
      console.error('Error counting report by collaborator:', error);
      throw error;
    }
  }

  async fetchReportByCollaboratorWithCost(page: number, limit: number) {
    try {
      const report = await EmployeeModel.findAll({
        include: [
          {
            //model: AssignmentModel,
            attributes: [
              ['benefit_type', 'benefitType'],
              ['assignment_date', 'assignmentDate']
            ],
            where: {
              [Op.or]: [{ benefit_type: 'DESCUENTO' }, { benefit_type: 'COMPLEMENTO' }, { benefit_type: 'SIN_COSTO' }]
            },
            required: true, // Ensures only employees with assignments are returned
            include: [
              {
                model: SlotModel,
                attributes: [['id', 'id']],
                include: [
                  {
                    model: LocationModel,
                    attributes: [
                      ['name', 'parkingName'],
                      ['number_of_identifier', 'volunteerNumber']
                    ],
                    required: true
                  }
                ],
                required: true
              }
            ]
          }
        ],
        attributes: [
          ['employee_code', 'employeeCode'],
          ['name', 'employeeName'],
          ['workplace', 'position'],
          ['department', 'department'],
          ['sub_management', 'subManagement'],
          ['management1', 'management1'],
          ['management2', 'management2'],
          ['work_site', 'site'],
          ['address', 'address'],
          [
            Sequelize.literal(`
              CASE
                WHEN \`assignment\`.\`benefit_type\` = 'DESCUENTO' THEN \`assignment->slot\`.\`amount\`
                ELSE 0
              END
            `),
            'discountAmount'
          ],
          [
            Sequelize.literal(`
              CASE
                WHEN \`assignment\`.\`benefit_type\` = 'COMPLEMENTO' THEN \`assignment->slot\`.\`amount\`
                ELSE 0
              END
            `),
            'refundAmount'
          ]
        ],
        limit,
        offset: (page - 1) * limit
      });

      return report;
    } catch (error) {
      console.error('Error fetching report by collaborator with cost:', error);
      throw error;
    }
  }

  async countReportByCollaboratorWithCost() {
    try {
      const totalCount = await EmployeeModel.count({
        include: [
          {
            //      model: AssignmentModel,
            required: true, // Ensures that only employees with assignments are counted
            where: {
              [Op.or]: [{ benefit_type: 'DESCUENTO' }, { benefit_type: 'COMPLEMENTO' }, { benefit_type: 'SIN_COSTO' }]
            },
            include: [
              {
                model: SlotModel,
                required: true, // Ensures only employees with valid slots are counted
                include: [
                  {
                    model: LocationModel,
                    required: true // Ensures only slots with valid locations are counted
                  }
                ]
              }
            ]
          }
        ]
      });
      return totalCount; // Returning the total count
    } catch (error) {
      console.error('Error fetching total report by collaborator with cost:', error);
      throw error;
    }
  }

  async fetchReportByAssignedParking(page: number, limit: number, startDate: string, endDate: string) {
    try {
      const report = await EmployeeModel.findAll({
        include: [
          {
            //model: AssignmentModel,
            required: true, // Ensures only employees with assignments are returned
            attributes: ['id', ['assignment_date', 'assignmentDate']],
            where: {
              assignment_date: {
                [Op.between]: [startDate, endDate] // Dynamically apply the date range filter
              }
            },
            include: [
              {
                model: SlotModel,
                required: true,
                attributes: [['slot_number', 'parkingCarNumber']], // No attributes needed for SlotModel since we only need slot_number
                include: [
                  {
                    model: LocationModel,
                    required: true,
                    attributes: [['name', 'parkingName']] // We need 'name' for parkingName
                  }
                ]
              }
            ]
          }
        ],
        attributes: [
          ['employee_code', 'employeeCode'],
          ['name', 'employeeName'],
          ['workplace', 'position'],
          ['department', 'department'],
          ['management1', 'management1'],
          ['work_site', 'site']
        ],
        limit,
        offset: (page - 1) * limit,
        order: [['employee_code', 'ASC']]
      });

      return report;
    } catch (error) {
      console.error('Error fetching report by collaborator with parking details:', error);
      throw error;
    }
  }

  async countReportByAssignedParking(startDate: string, endDate: string) {
    try {
      const totalCount = await EmployeeModel.count({
        include: [
          {
            //      model: AssignmentModel,
            required: true, // Ensures only employees with assignments are returned
            where: {
              assignment_date: {
                [Op.between]: [startDate, endDate] // Dynamically apply the date range filter
              }
            },
            include: [
              {
                model: SlotModel,
                required: true,
                attributes: [], // No attributes needed for SlotModel since we only need slot_number
                include: [
                  {
                    model: LocationModel,
                    required: true,
                    attributes: ['name'] // We need 'name' for parkingName
                  }
                ]
              }
            ]
          }
        ]
      });
      return totalCount; // Returning the total count
    } catch (error) {
      console.error('Error fetching total report by assigned parking:', error);
      throw error;
    }
  }
}

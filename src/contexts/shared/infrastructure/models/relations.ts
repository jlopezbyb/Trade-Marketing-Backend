//import { AssignmentModel } from './assignment/assignment.model';
import { EmployeeModel } from './assignment/employee.model';
import { LocationModel } from './parking/location.model';
import { SlotModel } from './parking/slot.model';
import { VehicleModel } from './assignment/vehicle.model';
//import { DiscountNoteModel } from './assignment/discount-note.model';
import { AssignmentLoanModel } from './assignment/assignment-loan';
import { RoleModel } from './auth/role.model';
import { RoleDetailModel } from './auth/role.detail.model';
import { ResourceModel } from './auth/resource.model';
import { UserModel } from './auth/user.model';
import { NotificationPreferenceModel } from './parameter/notification-preference';
import { NotificationTypeModel } from './notification/notification-type';
import { NotificationModel } from './notification/notification-model';
import { NotificationDetailModel } from './notification/notification-detail-model';

LocationModel.hasMany(SlotModel, {
  foreignKey: 'location_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
SlotModel.belongsTo(LocationModel, { foreignKey: 'location_id' });

EmployeeModel.hasOne(AssignmentLoanModel, {
  foreignKey: 'employee_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
AssignmentLoanModel.belongsTo(EmployeeModel, { foreignKey: 'employee_id' });

EmployeeModel.hasMany(VehicleModel, {
  foreignKey: 'employee_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
VehicleModel.belongsTo(EmployeeModel, { foreignKey: 'employee_id' });

RoleModel.belongsToMany(ResourceModel, {
  through: RoleDetailModel,
  foreignKey: 'role_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
ResourceModel.belongsToMany(RoleModel, {
  through: RoleDetailModel,
  foreignKey: 'resource_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});

RoleModel.hasMany(UserModel, {
  foreignKey: 'role_id',
  onUpdate: 'RESTRICT',
  onDelete: 'RESTRICT'
});
UserModel.belongsTo(RoleModel, { foreignKey: 'role_id' });

/*******Notification Preferences *******/
NotificationTypeModel.hasMany(NotificationPreferenceModel, { foreignKey: 'notificationType' });
UserModel.hasMany(NotificationPreferenceModel, { foreignKey: 'userId' });
NotificationPreferenceModel.belongsTo(UserModel, { foreignKey: 'userId' });
NotificationPreferenceModel.belongsTo(NotificationTypeModel, { foreignKey: 'notificationType' });

/*******Notification Relationships *******/
NotificationModel.hasMany(NotificationDetailModel, {
  foreignKey: 'notification_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
NotificationDetailModel.belongsTo(NotificationModel, {
  foreignKey: 'notification_id'
});

EmployeeModel.hasMany(NotificationDetailModel, {
  foreignKey: 'employee_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
NotificationDetailModel.belongsTo(EmployeeModel, {
  foreignKey: 'employee_id'
});

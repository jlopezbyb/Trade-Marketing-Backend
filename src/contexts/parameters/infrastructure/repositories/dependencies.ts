import { SequelizePostgresRepository } from './sequelize-postgres-repository';
import { SequelizeSettingMySQLRepository } from '../repositories/sequelize-setting-mysql-repository';
import { SequelizeMySqlTemplateRepository } from '../repositories/sequelize-mysql-template-repository';
import { NotificationPreferenceMySQLRepository } from './sequelize-mysql-notification-preference-repository';
import { MySQLSequelizeUserRepository } from '@src/contexts/auth/infrastructure/repositories/user-repository';

import { TagController } from '../controllers/tag.controller';
import { SettingController } from '../controllers/setting.controller';
import { TemplateController } from '../controllers/template.controller';
import { NotificationPreferenceController } from '../controllers/notification-preference-controller';

import { CreateTag } from '@src/contexts/parameters/application/use-cases/create-tag';
import { UpdateTag } from '@src/contexts/parameters/application/use-cases/update-tag';
import { DeleteTag } from '@src/contexts/parameters/application/use-cases/delete-tag';
import { TagFinderById } from '@src/contexts/parameters/application/use-cases/tag-finder-by-id';
import { TagFinder } from '@src/contexts/parameters/application/use-cases/tag-finder';

import { GetAllSettingsUseCase } from '../../application/setting/get-all-settings';
import { UpdateSettingUseCase } from '../../application/setting/update-setting';
import { GetByIdSettingUseCase } from '../../application/setting/get-by-id-setting';

import { GetTemplatesUseCase } from '@src/contexts/parameters/application/template/get-templates';
import { GetVariablesUseCase } from '@src/contexts/parameters/application/template/get-variables';
import { GetTemplateByIdUseCase } from '../../application/template/get-by-id-template';
import { UpdateTemplateUseCase } from '../../application/template/update-template';

import { GetPreferenceNotificationByUserUseCase } from '@src/contexts/parameters/application/setting/get-preference-by-user';
import { SaveNotificationPreferenceUseCase } from '@src/contexts/parameters/application/setting/save-notification-preference';

const repository = new SequelizePostgresRepository();
const settingRepository = new SequelizeSettingMySQLRepository();
const templateRepository = new SequelizeMySqlTemplateRepository();
const notificationPreferenceRepository = new NotificationPreferenceMySQLRepository();
const userRepository = new MySQLSequelizeUserRepository();

const createTagUseCase = new CreateTag(repository);
const updateTagUseCase = new UpdateTag(repository);
const deleteTagUseCase = new DeleteTag(repository);
const tagFinderByIdUseCase = new TagFinderById(repository);
const tagFinderUseCase = new TagFinder(repository);

const getAllSettingsUseCase = new GetAllSettingsUseCase(settingRepository);
const updateSettingUseCase = new UpdateSettingUseCase(settingRepository);
const getByIdSettingUseCase = new GetByIdSettingUseCase(settingRepository);

const getTemplatesUseCase = new GetTemplatesUseCase(templateRepository);
const getTemplateVariablesUseCase = new GetVariablesUseCase(templateRepository);
const getTemplateByIdUseCase = new GetTemplateByIdUseCase(templateRepository);
const updateTemplateUseCase = new UpdateTemplateUseCase(templateRepository);

const getPreferenceNotificationByUserUseCase = new GetPreferenceNotificationByUserUseCase(
  notificationPreferenceRepository,
  userRepository
);
const saveNotificationPreferenceUseCase = new SaveNotificationPreferenceUseCase(notificationPreferenceRepository, userRepository);

const tagController = new TagController(
  createTagUseCase,
  updateTagUseCase,
  deleteTagUseCase,
  tagFinderByIdUseCase,
  tagFinderUseCase
);

const settingController = new SettingController(getAllSettingsUseCase, updateSettingUseCase, getByIdSettingUseCase);

const templateController = new TemplateController(
  getTemplatesUseCase,
  getTemplateVariablesUseCase,
  getTemplateByIdUseCase,
  updateTemplateUseCase
);

const notificationPreferenceController = new NotificationPreferenceController(
  getPreferenceNotificationByUserUseCase,
  saveNotificationPreferenceUseCase
);

export { tagController, settingController, templateController, notificationPreferenceController };

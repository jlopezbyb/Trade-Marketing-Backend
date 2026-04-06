import { Sequelize } from 'sequelize';
import WinstonLogger from '@contexts/shared/infrastructure/WinstonLogger';
import { config } from '@src/server/config/env/envs';

const logger = new WinstonLogger();

export const sequelize = new Sequelize(
  config.DATABASE.DB_NAME,
  config.DATABASE.DB_USER,
  config.DATABASE.DB_PASSWORD,
  {
    host: config.DATABASE.DB_HOST,
    port: config.DATABASE.DB_PORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false
  }
);

const syncDatabase = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync({ force: false })
      .then(() => {
        resolve('Database synced');
      })
      .catch(err => {
        reject(err);
      });
  });
};

//TODO: Typo (startConnection)
export const sequelizeConnection = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then(() => {
        resolve('Connection has been established successfully.');
        if (config.APP.ENV === 'development') {
          syncDatabase()
            .then(message => logger.info(message as string))
            .catch(error => {
              logger.error(`Error syncing database ${error}`);
              reject(error);
            });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

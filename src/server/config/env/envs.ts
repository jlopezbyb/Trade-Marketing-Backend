import dotenv from 'dotenv';
import * as process from 'node:process';
import path from 'path';

const isTestEnvironment = process.env.NODE_ENV === 'test';

isTestEnvironment ? dotenv.config({ path: path.join(__dirname, '../../../../__tests__/.env') }) : dotenv.config();

export const config = {
  APP: {
    PORT: isTestEnvironment ? 0 : process.env.PORT,
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'dev',
    ENV: process.env.NODE_ENV ?? 'development',
    URL_LDAP: process.env.URL_LDAP ?? 'https://172.22.90.181:9076/ValidacionUsuarios/BuscaUsuarioWsService'
  },
  DATABASE: {
    DB_USER: process.env.DB_USER ?? 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD ?? 'admin',
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_NAME: process.env.DB_NAME ?? 'trade_marketing',
    DB_PORT: parseInt(process.env.DB_PORT ?? '5432')
  },
  MAIL: {
    MAIL_HOST: process.env.MAIL_HOST ?? 'smtp.gmail.com',
    MAIL_PORT: parseInt(process.env.MAIL_PORT ?? '465'),
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD
  },
  JWT: {
    SECRET: process.env.JWT_SECRET ?? 'secret',
    EXP: process.env.JWT_EXPIRATION ?? '2h',
    EXP_REFRESH: process.env.JWT_REFRESH_EXP ?? '1d'
  },
  ENTRA_ID: {
    CLIENT_ID: process.env.ENTRA_CLIENT_ID,
    TENANT_ID: process.env.ENTRA_TENANT_ID
  }
};

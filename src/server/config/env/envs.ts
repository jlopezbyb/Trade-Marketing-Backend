import dotenv from 'dotenv';
import * as process from 'node:process';
import path from 'path';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const parseBoolean = (value: string | undefined, defaultValue: boolean = false) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

const parseCsvList = (value: string | undefined, fallback: string[]) => {
  if (!value) {
    return fallback;
  }

  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};

const defaultCorsAllowedOrigins = [
  'https://devparqueosrrhh.claro.com.gt',
  'https://d123456abcdef.cloudfront.net',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:4200',
  'https://localhost:4200',
  'http://localhost:5173',
  'https://localhost:5173',
  'https://dy3ohu4eojzw6.cloudfront.net',
  'https://parqueosrrhh.claro.com.gt',
  'https://admin.parqueosrrhh.claro.com.gt',
  'https://claro-com-gt.access.mcas.ms',
  'https://login.microsoftonline.com'
];

isTestEnvironment ? dotenv.config({ path: path.join(__dirname, '../../../../__tests__/.env') }) : dotenv.config();

export const config = {
  APP: {
    PORT: isTestEnvironment ? 0 : parseInt(process.env.PORT ?? '3500', 10),
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'dev',
    ENV: process.env.NODE_ENV ?? 'development',
    URL_LDAP: process.env.URL_LDAP ?? 'https://172.22.90.181:9076/ValidacionUsuarios/BuscaUsuarioWsService',
    HTTPS_ENABLED: !isTestEnvironment && parseBoolean(process.env.HTTPS_ENABLED, false),
    HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH,
    HTTPS_CERT_PATH: process.env.HTTPS_CERT_PATH,
    HTTPS_CA_PATH: process.env.HTTPS_CA_PATH,
    HTTPS_PFX_PATH: process.env.HTTPS_PFX_PATH,
    HTTPS_PFX_PASSPHRASE: process.env.HTTPS_PFX_PASSPHRASE,
    CORS_ALLOWED_ORIGINS: parseCsvList(process.env.CORS_ALLOWED_ORIGINS, defaultCorsAllowedOrigins)
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

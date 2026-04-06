import http from 'node:http';
import { AddressInfo } from 'node:net';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { config } from '@src/server/config/env/envs';
import WinstonLogger from '@contexts/shared/infrastructure/WinstonLogger';
import { sequelizeConnection } from '@src/server/config/database/sequelize';
import { sequelize } from '@src/server/config/database/sequelize';
import '@contexts/shared/infrastructure/models/relations';

import { handleErrors } from '@src/server/middleware/handle-errors';
import routes from '@src/contexts/shared/infrastructure/routes/index';
import { RequestHandler } from 'express';
import path from 'node:path';

export class Server {
  private readonly app: express.Application;
  private server?: http.Server;
  private logger: WinstonLogger;

  constructor() {
    this.logger = new WinstonLogger();
    this.app = express();
    this.loadMiddlewares();
    this.loadRoutes();
  }

  private loadMiddlewares() {
    // 🌐 CORS configuración
    const allowedOrigins = [
      'https://devparqueosrrhh.claro.com.gt',
      'https://d123456abcdef.cloudfront.net',
      'http://localhost:4200',
      'https://dy3ohu4eojzw6.cloudfront.net',
      'https://parqueosrrhh.claro.com.gt',
      'https://admin.parqueosrrhh.claro.com.gt',
      'https://claro-com-gt.access.mcas.ms',
      'https://login.microsoftonline.com'
    ];

    const corsOptions: cors.CorsOptions = {
      origin: (origin, callback) => {
        //console.log(`🌐 CORS Origin: ${origin}`);
        if (!origin || allowedOrigins.includes(origin)) {
          //console.log(`✅ CORS permitido: ${origin}`);
          callback(null, true);
        } else {
          console.warn(`🚫 CORS bloqueado: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'authorization',
        'content-type',
        'x-csrf-token',
        'x-requested-with',
        'x-forwarded-for',
        'x-forwarded-proto'
      ],
      exposedHeaders: ['authorization', 'set-cookie', 'x-token-expiry'],
      preflightContinue: false,
      optionsSuccessStatus: 204
    };

    // ✅ CORS debe ir al inicio
    this.app.options('*', cors(corsOptions));
    this.app.use(cors(corsOptions));

    // 🛡️ Nonce por solicitud (para CSP)
    this.app.use((req, res, next) => {
      res.locals.nonce = crypto.randomBytes(16).toString('base64');
      next();
    });

    // 🛡️ Helmet CSP
    this.app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", (req, res) => `'nonce-${(res as express.Response).locals.nonce}'`],
          styleSrc: ["'self'", (req, res) => `'nonce-${(res as express.Response).locals.nonce}'`],
          objectSrc: ["'none'"]
        }
      })
    );

    // 🔎 Log de OPTIONS para debug
    this.app.use((req, res, next) => {
      if (req.method === 'OPTIONS') {
        //console.log(`📥 [OPTIONS] ${req.method} ${req.originalUrl}`);
        //console.log(`🔎 Headers:`, req.headers);
      }
      next();
    });

    // 🍪 Cookies
    this.app.use(cookieParser() as unknown as RequestHandler);

    // // 🔐 CSRF Protection
    // this.app.use((req, res, next) => {
    //   const token = req.cookies['csrfToken'];
    //   if (token) console.log(`🔐 CSRF token recibido en cookie: ${token}`);
    //   next();
    // });

    // this.app.use(attachCSRFToken);
    // this.app.use(validateCSRF);

    // 🚀 Middlewares base
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan(config.APP.LOG_LEVEL));

    // 📂 Archivos públicos
    this.app.use(express.static(path.resolve(process.cwd(), 'public')));
    this.app.use('/scripts', express.static(path.join(__dirname, 'public', 'scripts')));
  }

  private loadRoutes() {
    this.app.use(routes);
    this.app.use(handleErrors);
  }

  public startServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      sequelizeConnection()
        .then(message => {
          this.server = this.app.listen(config.APP.PORT, () => {
            const { port, address } = this.server?.address() as AddressInfo;
            this.logger.info(`🚀 Server running on port ${address}:${port}`);
            this.logger.info(message as string);
            resolve();
          });
        })
        .catch(error => {
          this.logger.error(error);
          reject(error);
        });
    });
  }

  public stopServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server?.close(async error => {
        if (error) {
          this.logger.error(error);
          reject(error);
        }
        await sequelize.close();
        this.logger.info('🛑 Server closed');
        resolve();
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

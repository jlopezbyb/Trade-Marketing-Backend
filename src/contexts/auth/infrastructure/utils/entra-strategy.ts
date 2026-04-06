import passport from 'passport';
import dotenv from 'dotenv';
import { Profile, Strategy as OpenIDConnectStrategy, VerifyCallback } from 'passport-openidconnect';
import { config } from '@src/server/config/env/envs';

dotenv.config();

const entraClientId = config.ENTRA_ID.CLIENT_ID;
const entraClientSecret = config.ENTRA_ID.CLIENT_SECRET;
const entraTenantId = config.ENTRA_ID.TENANT_ID;
const entraCallbackUrl = config.ENTRA_ID.CALLBACK_URL;
const entraEmployeeCallbackUrl = config.ENTRA_ID.EMPLOYEE_CALLBACK_URL;

if (!entraClientId || !entraClientSecret || !entraTenantId || !entraCallbackUrl || !entraEmployeeCallbackUrl) {
  throw new Error('Faltan variables de entorno para configuración Entra ID');
}

const issuer = `https://login.microsoftonline.com/${entraTenantId}/v2.0`;

// Verify function for OpenID Connect
const oidcVerify = (_issuer: string, profile: Profile, done: VerifyCallback): void => {
  if (!profile || typeof profile !== 'object') {
    done(new Error('Perfil de OIDC inválido'));
    return;
  }
  done(null, profile);
};

// Common options for Entra ID
const commonOptions = {
  issuer,
  authorizationURL: `${issuer}/oauth2/v2.0/authorize`,
  tokenURL: `${issuer}/oauth2/v2.0/token`,
  userInfoURL: `${issuer}/oauth2/v2.0/userinfo`,
  clientID: entraClientId,
  clientSecret: entraClientSecret,
  callbackURL: entraCallbackUrl,
  scope: ['openid', 'profile', 'email'],
  response_type: 'code',
  response_mode: 'form_post',
  skipUserProfile: false,
  passReqToCallback: false
};

// Strategy for ADMINISTRATORS
passport.use(
  'entra-admin',
  new OpenIDConnectStrategy(
    {
      ...commonOptions,
      callbackURL: entraCallbackUrl
    },
    oidcVerify
  )
);

// Strategy for EMPLEADOS
passport.use(
  'entra-employee',
  new OpenIDConnectStrategy(
    {
      ...commonOptions,
      callbackURL: entraEmployeeCallbackUrl
    },
    oidcVerify
  )
);

// Serialize/deserialize for Passport sessions
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: Express.User, done) => done(null, obj));

export {};

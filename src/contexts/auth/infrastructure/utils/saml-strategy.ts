import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as SamlStrategy, type Profile, type VerifyWithoutRequest } from '@node-saml/passport-saml';

dotenv.config();

const samlCertEnv = process.env.SAML_CERT;
const entryPoint = process.env.SAML_ENTRY_POINT;
const issuer = process.env.SAML_ISSUER; // SP entityID
const callbackUrl = process.env.SAML_CALLBACK_URL; // ACS admins
const callbackEmployeesUrl = process.env.SAML_CALLBACK_EMPLOYEES_URL; // ACS empleados

if (!samlCertEnv || !entryPoint || !issuer || !callbackUrl || !callbackEmployeesUrl) {
  throw new Error('Faltan variables de entorno para configuración SAML');
}

// Normaliza \n y soporta múltiples certs separados por "||"
function parseIdpCerts(raw: string): string[] {
  const normalized = raw.replace(/\\n/g, '\n').trim();
  const parts = normalized
    .split('||')
    .map(p => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [normalized];
}

const idpCerts = parseIdpCerts(samlCertEnv);

// Verify para sign-on
const signonVerify: VerifyWithoutRequest = (profile: Profile | null | undefined, done) => {
  if (!profile || typeof profile !== 'object') {
    return done(new Error('Perfil de SAML inválido'));
  }
  return done(null, profile as Record<string, unknown>);
};

// Verify para logout (requerido por el ctor)
const logoutVerify: VerifyWithoutRequest = (profile, done) => {
  return done(null, profile || {});
};

// Opciones comunes
const common = {
  entryPoint, // IdP SSO URL
  issuer, // SP entityID
  idpCert: idpCerts, // <-- usa 'idpCert' (string | string[])
  forceAuthn: true,

  // Firma — asume Assertion firmada (ajústalo según tu IdP):
  wantAuthnResponseSigned: false,
  wantAssertionsSigned: true,

  disableRequestedAuthnContext: true,
  acceptedClockSkewMs: 5000
  // identifierFormat: null,   // descomenta si tu IdP no quiere NameID format
};

// ✅ Estrategia para ADMINISTRADORES
passport.use('saml-admin', new SamlStrategy({ ...common, callbackUrl }, signonVerify, logoutVerify));

// ✅ Estrategia para EMPLEADOS
passport.use('saml-employee', new SamlStrategy({ ...common, callbackUrl: callbackEmployeesUrl }, signonVerify, logoutVerify));

// (Opcional) Si usas sesiones de Passport
passport.serializeUser((user, done) => done(null, user as any));
passport.deserializeUser((obj, done) => done(null, obj as any));

export {};

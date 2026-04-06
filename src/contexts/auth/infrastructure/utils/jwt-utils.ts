import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { config } from '@src/server/config/env/envs';

interface JwtPayload {
  user: string;
  role: string;
  type: 'admin';
  resources: string[];
  iat: number;
  exp: number;
  aud: string;
}

interface DecodedJwt {
  header: {
    alg: string;
    typ: string;
  };
  payload: JwtPayload;
  signature: string;
}

export const createToken = (payload: object) => {
  const token = jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXP,
    audience: 'devparqueosrrhh.claro.com.gt'
  });
  const refreshToken = jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXP_REFRESH,
    audience: 'devparqueosrrhh.claro.com.gt'
  });

  return {
    token,
    refreshToken
  };
};

export const validateToken = (token: string) => {
  try {
    jwt.verify(token, config.JWT.SECRET);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getPayload = (token: string): JwtPayload | null => {
  const decoded = jwt.decode(token, {
    json: true,
    complete: true
  }) as DecodedJwt | null;

  if (decoded && decoded.payload) {
    return decoded.payload;
  }

  return null;
};

// Entra ID JWT validation
interface EntraIdJwtPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
  email?: string;
  preferred_username?: string;
  name?: string;
  roles?: string[];
  scp?: string;
  [key: string]: any;
}

export const validateEntraIdToken = async (
  token: string,
  tenantId: string,
  clientId: string
): Promise<EntraIdJwtPayload | null> => {
  try {
    const decoded = jwt.decode(token, { complete: true }) as any;
    if (!decoded) return null;

    const kid = decoded.header.kid;
    if (!kid) return null;

    // JWKS client for Entra ID
    const jwksClient = jwksRsa({
      jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
    });

    const key = await jwksClient.getSigningKey(kid);
    const publicKey = key.getPublicKey();

    // Verify the token
    const verified = jwt.verify(token, publicKey, {
      issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      audience: clientId,
      algorithms: ['RS256']
    }) as EntraIdJwtPayload;

    // Additional checks
    const now = Math.floor(Date.now() / 1000);
    if (verified.exp < now || verified.nbf > now) {
      return null;
    }

    return verified;
  } catch (error) {
    console.error('Error validating Entra ID token:', error);
    return null;
  }
};

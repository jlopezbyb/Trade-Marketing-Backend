import { CookieOptions, Request } from 'express';

const getForwardedProtocol = (request: Request) => {
  const forwardedProto = request.headers['x-forwarded-proto'];

  if (Array.isArray(forwardedProto)) {
    return forwardedProto[0];
  }

  return forwardedProto;
};

export const createAuthCookieOptions = (request: Request): CookieOptions => {
  const isHttps = request.secure || getForwardedProtocol(request) === 'https';

  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? 'none' : 'lax',
    path: '/'
  };
};

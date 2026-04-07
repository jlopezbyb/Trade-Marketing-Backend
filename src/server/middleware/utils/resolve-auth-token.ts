import { Request } from 'express';

const normalizeToken = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  return value.startsWith('Bearer ') ? value.slice(7) : value;
};

export const resolveAuthToken = (request: Request, cookieName: string = 'token') => {
  const cookieToken = typeof request.cookies?.[cookieName] === 'string' ? request.cookies[cookieName] : undefined;
  if (cookieToken) {
    return normalizeToken(cookieToken);
  }

  const authorizationHeader = request.headers.authorization;
  if (typeof authorizationHeader === 'string' && authorizationHeader.startsWith('Bearer ')) {
    return normalizeToken(authorizationHeader);
  }

  return null;
};

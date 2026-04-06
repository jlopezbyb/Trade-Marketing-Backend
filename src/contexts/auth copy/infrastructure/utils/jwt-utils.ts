import jwt from 'jsonwebtoken';
import { config } from '@src/server/config/env/envs';

interface JwtPayload {
  user: string; // Email
  employeeCode: string;
  assignmentId: string;
  type: string;
}

export const createToken = (email: string, employeeCode: string, assignmentId: string, type: 'employee') => {
  const payload: JwtPayload = {
    user: email,
    employeeCode,
    assignmentId,
    type
  };

  const token = jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXP,
    audience: 'devparqueosrrhh.claro.com.gt'
  });

  const refreshToken = jwt.sign(payload, config.JWT.SECRET, {
    expiresIn: config.JWT.EXP_REFRESH,
    audience: 'devparqueosrrhh.claro.com.gt'
  });

  return { token, refreshToken };
};

export const validateToken = (token: string): boolean => {
  try {
    jwt.verify(token, config.JWT.SECRET);
    return true;
  } catch {
    return false;
  }
};

export const getPayload = (token: string): JwtPayload | null => {
  const decoded = jwt.decode(token) as JwtPayload | null;
  return decoded ?? null;
};

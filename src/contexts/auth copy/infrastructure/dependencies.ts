import { AuthEmployeeRepository } from './repositories/auth-repository';
import { LoginEmployeeUseCase } from '../application/use-cases/auth/login';
import { AuthEmployeeController } from './controller/auth.Employee.controller';
import { RefreshTokenUseCase } from '@src/contexts/auth copy/application/use-cases/auth/refresh-token';

// Repositorio
const authEmployeeRepository = new AuthEmployeeRepository();

// Casos de uso
const loginEmployeeUseCase = new LoginEmployeeUseCase(authEmployeeRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(authEmployeeRepository);

// Controlador
export const authController = new AuthEmployeeController(loginEmployeeUseCase, refreshTokenUseCase);

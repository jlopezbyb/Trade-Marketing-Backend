import { AuthJWTRepository } from '@src/contexts/auth/infrastructure/repositories/auth-repository';

import { AuthController } from '@src/contexts/auth/infrastructure/controller/auth.controller';

import { LoginUseCase } from '@src/contexts/auth/application/use-cases/auth/login';

const authRepository = new AuthJWTRepository();

const authUseCase = new LoginUseCase(authRepository);

const authController = new AuthController(authUseCase);

export { authController };

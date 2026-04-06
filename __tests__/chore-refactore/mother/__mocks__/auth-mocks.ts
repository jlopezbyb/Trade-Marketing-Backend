import { AuthRepository } from "../../src/auth/domain/repository/auth-repository";


export const mockAuth: jest.Mocked<AuthRepository> = {
  findUserByUsername: jest.fn().mockReturnValue(null),
  getRoleById: jest.fn().mockReturnValue(null),
}

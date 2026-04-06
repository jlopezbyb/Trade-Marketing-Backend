import { UserRepository } from "../../src/auth/domain/repository/user-repository";

export const mockUserRepository : jest.Mocked<UserRepository> = {
   create: jest.fn(),
   delete: jest.fn(),
   update: jest.fn(),
   getById: jest.fn().mockReturnValue({}),
   getAll: jest.fn().mockReturnValue([]),
}

import { RoleRepository } from "../../src/auth/domain/repository/role-repository";

export const mockRoleRepository : jest.Mocked<RoleRepository> = {
   create: jest.fn(),
   delete: jest.fn(),
   update: jest.fn(),
   getById: jest.fn().mockReturnValue({}),
   getAll: jest.fn().mockReturnValue([]),
   getResources: jest.fn().mockReturnValue([])
}

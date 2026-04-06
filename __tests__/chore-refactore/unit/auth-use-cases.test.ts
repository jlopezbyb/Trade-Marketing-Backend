import { mockAuth } from "../__mocks__/auth-mocks";

import { LoginUseCase } from "../../src/auth/application/use-cases/auth/login";
import { RefreshTokenUseCase } from "../../src/auth/application/use-cases/auth/refresh-token";
import { UserEntity } from "../../src/auth/domain/entities/user-entity";
import { RoleEntity } from "../../src/auth/domain/entities/role-entity";

describe("USE_CASE: Auth", () => {

  const userEntity = UserEntity.fromPrimitives({
      id: "1", username: "test", email: "test@test.com",
      name: "test", password: "test", phone: "123456789",
      role: "1",
      status: "ACTIVO",
      });

  const roleEntity = RoleEntity.fromPrimitives({
    id: "1", name: "ROLE_USER", description: "User role", status: "ACTIVO", resources: [{
      id: "1", slug: "SLUG", description: "description", can_access: true
    }]
  });

  describe("USE_CASE: Login", () => {
    it("should return a user and roles", async () => {
      const userData = { username: "test", password: "test" };
      const loginUseCase = new LoginUseCase(mockAuth);
      mockAuth.findUserByUsername.mockResolvedValueOnce(userEntity);
      mockAuth.getRoleById.mockResolvedValueOnce(roleEntity);
      const result = await loginUseCase.run(userData);
      expect(result).toEqual({ user: userEntity, role: roleEntity });
    });

    it('throw an error if user or role not found', async () => {
      const userData = { username: "test", password: "test" };
      const loginUseCase = new LoginUseCase(mockAuth);
      mockAuth.findUserByUsername.mockResolvedValueOnce(null);
      await expect(loginUseCase.run(userData)).rejects.toThrow('User not found');

      mockAuth.findUserByUsername.mockResolvedValueOnce(userEntity);
      mockAuth.getRoleById.mockResolvedValueOnce(null);
      await expect(loginUseCase.run(userData)).rejects.toThrow('Role not found');
    });
  })

  describe('USE_CASE: Refresh Token', () => {
    it('should return a new token', async () => {
      const refreshTokenUseCase = new RefreshTokenUseCase(mockAuth);
      mockAuth.findUserByUsername.mockResolvedValueOnce(userEntity);
      mockAuth.getRoleById.mockResolvedValueOnce(roleEntity);
      const result = await refreshTokenUseCase.run(userEntity.username);
      expect(result).toEqual({ user: userEntity, role: roleEntity });
    });

    it('throw an error if user or role not found', async () => {
      const refreshTokenUseCase = new RefreshTokenUseCase(mockAuth);
      mockAuth.findUserByUsername.mockResolvedValueOnce(null);
      await expect(refreshTokenUseCase.run(userEntity.username)).rejects.toThrow('User not found');

      mockAuth.findUserByUsername.mockResolvedValueOnce(userEntity);
      mockAuth.getRoleById.mockResolvedValueOnce(null);
      await expect(refreshTokenUseCase.run(userEntity.username)).rejects.toThrow('Role not found');
    });
  })
})

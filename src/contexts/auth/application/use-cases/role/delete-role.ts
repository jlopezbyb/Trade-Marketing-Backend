import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class DeleteRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(id: string) {
    const role = await this.roleRepository.getById(id);

    if (!role) {
      throw new AppError('ROLE_NOT_FOUND', 404, 'Role not found', true);
    }

    const activeUsers = await this.roleRepository.getUsersActiveByRoleId(id);

    if (activeUsers.length > 0) {
      throw new AppError('CANNOT_DELETE_ACTIVE_ROLE', 400, 'You can not delete a role with active users', true);
    }

    await this.roleRepository.delete(id);
  }
}

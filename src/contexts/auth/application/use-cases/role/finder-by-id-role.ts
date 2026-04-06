import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class FinderById {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(id: string) {
    const role = await this.roleRepository.getById(id);

    if (!role) {
      throw new AppError('ROLE_NOT_FOUND', 404, 'Role not found', true);
    }

    return role;
  }
}

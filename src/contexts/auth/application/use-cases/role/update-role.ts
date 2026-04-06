import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class UpdateRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(data: { id: string; name: string; description: string; status: 'ACTIVO' | 'INACTIVO'; listOfAccess: [] }) {
    const role = await this.roleRepository.getById(data.id);

    if (!role) {
      throw new AppError('ROLE_NOT_FOUND', 404, 'Role not found', true);
    }

    const resources = await this.roleRepository.getResources();
    const resourceIds = new Set(resources.map(res => res.id));

    data.listOfAccess.forEach((access: { resource: string; can_access: boolean }) => {
      if (!resourceIds.has(access.resource)) {
        throw new AppError('RESOURCE_NOT_FOUND', 400, `Resource not found: ${access.resource}`, true);
      }
    });

    await this.roleRepository.update(data);
  }
}

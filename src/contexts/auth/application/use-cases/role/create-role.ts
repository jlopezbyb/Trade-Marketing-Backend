import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class CreateRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(data: { name: string; description: string; status: string; listOfAccess: [] }) {
    const resources = await this.roleRepository.getResources();

    const resourceIds = new Set(resources.map(res => res.id));

    data.listOfAccess.forEach((access: { resource: string; can_access: boolean }) => {
      if (!resourceIds.has(access.resource)) {
        throw new AppError('RESOURCE_NOT_FOUND', 400, `Resource not found: ${access.resource}`, true);
      }
    });

    if (resourceIds.size !== data.listOfAccess.length) {
      throw new AppError('RESOURCE_INCOMPLETE', 400, 'You must send all available resources', true);
    }
    await this.roleRepository.create(data);
  }
}

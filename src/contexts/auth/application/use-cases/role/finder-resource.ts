import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';

export class FinderResource {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run() {
    return await this.roleRepository.getResources();
  }
}

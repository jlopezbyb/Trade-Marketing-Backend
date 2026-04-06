import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';

export class FinderRole {
  constructor(private readonly roleRepository: RoleRepository) {}

  async run(limit: number, page: number) {
    return await this.roleRepository.getAll(limit, page);
  }
}

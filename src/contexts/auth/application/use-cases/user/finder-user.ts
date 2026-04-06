import { UserRepository } from '@src/contexts/auth/core/repository/user-repository';

export class FinderUser {
  constructor(private readonly userRepository: UserRepository) {}

  async run(limit: number, page: number) {
    return await this.userRepository.getAll(limit, page);
  }
}

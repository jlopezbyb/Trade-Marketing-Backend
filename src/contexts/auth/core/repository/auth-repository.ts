import { UserEntity } from '../entities/user-entity';

export interface AuthRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>;
}

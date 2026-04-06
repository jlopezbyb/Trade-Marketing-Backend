import { AuthRepository } from '@src/contexts/auth/core/repository/auth-repository';
import { UserModel } from '@src/contexts/shared/infrastructure/models/auth/user.model';
import { UserEntity } from '@src/contexts/auth/core/entities/user-entity';

export class AuthJWTRepository implements AuthRepository {
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const userDatabase = await UserModel.findOne({
      where: { email, activo: true }
    });
    if (!userDatabase) return null;
    return UserEntity.fromPrimitives(userDatabase.get({ plain: true }));
  }
}

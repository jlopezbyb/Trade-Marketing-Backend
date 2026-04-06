import { UniqueConstraintError } from 'sequelize';
import { RoleEntity } from '@src/contexts/auth/core/entities/role-entity';
import { RoleRepository } from '@src/contexts/auth/core/repository/role-repository';
import { UserRepository } from '@src/contexts/auth/core/repository/user-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async run(user: {
    name: string;
    email: string;
    username: string;
    password: string;
    status: 'ACTIVO' | 'INACTIVO';
    phone: string;
    role: RoleEntity | string;
  }) {
    const roleDatabase = await this.roleRepository.getById((user.role || '') as string);

    if (!roleDatabase) {
      throw new AppError('ROLE_NOT_FOUND', 404, 'Role not found', true);
    }

    if (roleDatabase.status === 'INACTIVO') {
      throw new AppError('ROLE_INACTIVE', 400, 'You can not create a user with an inactive role', true);
    }

    try {
      await this.userRepository.create(user);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        // Verificar si el conflicto es por un usuario no eliminado
        const existingUser = await this.userRepository.getByEmailOrUsername(user.email, user.username);
        if (existingUser && !existingUser.deleted_at) {
          throw new AppError('USER_ALREADY_EXISTS', 400, 'User already exists', true);
        }
        // Si llega aquí, el repositorio ya manejó la recreación del usuario eliminado
      } else {
        throw error;
      }
    }
  }
}

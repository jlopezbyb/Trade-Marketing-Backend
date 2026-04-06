import { faker } from '@faker-js/faker';
import { UserEntity } from '../../../src/contexts/auth/core/entities/user-entity';
import { UserModel } from '../../../src/contexts/shared/infrastructure/models/auth/user.model';

export class UserBuilder {
  private userEntity: UserEntity;

  constructor(role: string){
    this.userEntity = UserEntity.fromPrimitives({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      username: faker.lorem.word({ length: 35 }),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: '+(502) 45573001',
      status: faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
      role,
    })
  }

  withActiveStatus(): UserBuilder {
    this.userEntity = UserEntity.fromPrimitives({...this.userEntity.toPrimitives(), status: 'ACTIVO'});
    return this;
  }
  withInactiveStatus(): UserBuilder {
    this.userEntity = UserEntity.fromPrimitives({...this.userEntity.toPrimitives(), status: 'INACTIVO'});
    return this;
  }

  async build(): Promise<UserEntity> {
    await UserModel.create({...this.userEntity.toPrimitives(), role_id: this.userEntity.role});
    return this.userEntity;
  }
}

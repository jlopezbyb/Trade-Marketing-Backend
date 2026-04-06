import { RoleEntity } from './role-entity';

export type UserStatus = 'ACTIVO' | 'INACTIVO';

export class UserEntity {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly status: UserStatus;
  readonly phone: string;
  readonly role: RoleEntity | string;
  readonly deleted_at?: Date | null;

  constructor(
    id: string,
    name: string,
    email: string,
    username: string,
    password: string,
    status: UserStatus,
    phone: string,
    role: RoleEntity | string,
    deleted_at?: Date | null
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
    this.status = status;
    this.phone = phone;
    this.role = role;
    this.deleted_at = deleted_at;
  }

  static fromPrimitives(plainData: {
    id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    status: UserStatus;
    phone: string;
    role: RoleEntity | string;
  }): UserEntity {
    return new UserEntity(
      plainData.id,
      plainData.name,
      plainData.email,
      plainData.username,
      plainData.password,
      plainData.status,
      plainData.phone,
      plainData.role instanceof RoleEntity ? RoleEntity.fromPrimitives(plainData.role) : plainData.role
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
      status: this.status,
      phone: this.phone,
      role: this.role
    };
  }
}

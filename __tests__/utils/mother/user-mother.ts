import { faker } from "@faker-js/faker";
import { UserEntity, UserStatus } from "../../../src/contexts/auth/core/entities/user-entity";

export class UserMother{
  static createUserEntity({
    id = faker.string.uuid(),
    name = faker.person.fullName(),
    email = faker.internet.email(),
    username = faker.internet.userName(),
    password = faker.internet.password(),
    status = "ACTIVO" as UserStatus,
    phone = faker.phone.number(),
    role= ""
  }): UserEntity {
    return new UserEntity(id, name, email, username, password, status, phone, role);
  }
}

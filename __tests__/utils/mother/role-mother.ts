import { faker } from "@faker-js/faker";
import { Resource, RoleEntity } from "../../../src/contexts/auth/core/entities/role-entity";
import { RoleStatus } from "../../../src/contexts/auth/core/entities/role-entity";
import { ResourceEntity } from "../../../src/contexts/auth/core/entities/resource-entity";

export class RoleMother{
  static createRole({
    id = faker.string.uuid(),
    name = faker.person.fullName(),
    description = faker.lorem.sentence(),
    status = "ACTIVO" as RoleStatus,
    resources = this.createResources()
  }): RoleEntity {
    return new RoleEntity(id, name, description, status, resources);
  }

  static createResourceEntity(): ResourceEntity {
    return new ResourceEntity(faker.string.uuid(), faker.lorem.word(), faker.lorem.sentence())
  }

  static createResources(): Resource[] {
    return [{...this.createResourceEntity(), can_access: true}, {...this.createResourceEntity(), can_access: true}]
  }
}

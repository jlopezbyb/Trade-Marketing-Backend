import { RoleEntity, Resource, RoleStatus } from '../../../src/contexts/auth/core/entities/role-entity';
import { faker } from '@faker-js/faker';
import { RoleModel } from '../../../src/contexts/shared/infrastructure/models/auth/role.model';
import { ResourceModel } from '../../../src/contexts/shared/infrastructure/models/auth/resource.model';
import { RoleDetailModel } from '../../../src/contexts/shared/infrastructure/models/auth/role.detail.model';

export class RoleBuilder {
  private role: RoleEntity;
  private resources: Resource[];

  constructor() {
    this.resources = [
      {
        id: '76576cf3-09e5-4172-8acf-de56c49e75e7',
        slug: faker.lorem.word(),
        description: faker.lorem.word(),
        canAccess: false
      },
      {
        id: '4142c1ab-e3e5-43c4-979a-001c779cc150',
        slug: faker.lorem.word(),
        description: faker.lorem.word(),
        canAccess: false
      },
      {
        id: 'dd688388-e528-4c73-9f68-88faa7ad933a',
        slug: faker.lorem.word(),
        description: faker.lorem.word(),
        canAccess: false
      }
    ];
    this.role = new RoleEntity(
      faker.string.uuid(),
      faker.lorem.word(),
      faker.lorem.word(),
      faker.helpers.arrayElement(['ACTIVO', 'INACTIVO']),
      this.resources
    );
  }

  withoutAccessResources(): RoleBuilder {
    this.resources = [
      {
        id: '76576cf3-09e5-4172-8acf-de56c49e75e7',
        slug: faker.lorem.word(),
        description: faker.lorem.word(),
        canAccess: false
      },
      {
        id: '4142c1ab-e3e5-43c4-979a-001c779cc150',
        slug: faker.lorem.word(),
        description: faker.lorem.word(),
        canAccess: false
      },
      {
        id: 'dd688388-e528-4c73-9f68-88faa7ad933a',
        slug: faker.lorem.word(),
        description: faker.lorem.word(),
        canAccess: false
      }
    ];

    return this;
  }

  withAccessResources(): RoleBuilder {
    this.resources = [
      {
        id: '76576cf3-09e5-4172-8acf-de56c49e75e7',
        slug: faker.lorem.word(),
        description: faker.lorem.word(),
        canAccess: true
      },
      {
        id: '4142c1ab-e3e5-43c4-979a-001c779cc150',
        slug: faker.lorem.word(),
        description: faker.lorem.word(),
        canAccess: true
      },
      {
        id: 'dd688388-e528-4c73-9f68-88faa7ad933a',
        slug: faker.lorem.word(),
        description: faker.lorem.word(),
        canAccess: true
      }
    ];

    return this;
  }

  withActiveStatus(): RoleBuilder {
    this.role = RoleEntity.fromPrimitives({...this.role.toPrimitives(),resources: this.role.resources,  status: 'ACTIVO'});
    return this;
  }

  withInactiveStatus(): RoleBuilder {
    this.role = RoleEntity.fromPrimitives({...this.role.toPrimitives(),resources: this.role.resources,  status: 'INACTIVO'});
    return this;
  }

  async build(): Promise<RoleEntity> {
    try {
      await this.buildResources();
      await RoleModel.create(this.role.toPrimitives());
      await RoleDetailModel.bulkCreate(
        this.resources.map(resource => ({ role_id: this.role.id, resource_id: resource.id, can_access: resource.canAccess }))
      );
    } catch (error) {
      console.log(error);
    }
    return this.role;
  }

  async buildResources(): Promise<Resource[]> {
    try {
      await ResourceModel.bulkCreate(this.resources);
    } catch (error) {
      console.log(error);
    }
    return this.resources;
  }
}

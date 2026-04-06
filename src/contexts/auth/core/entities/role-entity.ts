import { ResourceEntity } from './resource-entity';

export type Resource = Pick<ResourceEntity, 'id' | 'slug' | 'description'> & {
  canAccess: boolean;
};

export class RoleEntity {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: string;
  resources: Resource[];

  constructor(id: string, name: string, description: string, status: string, resources: Resource[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.resources = resources;
  }

  static fromPrimitives(plainData: {
    id: string;
    name: string;
    description: string;
    status: string;
    resources: Resource[];
  }): RoleEntity {
    const resources = plainData.resources.map(resource => {
      return {
        id: resource.id,
        slug: resource.slug,
        description: resource.description,
        canAccess: resource.canAccess
      };
    });

    return new RoleEntity(plainData.id, plainData.name, plainData.description, plainData.status, resources);
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status,
      resources: this.resources
    };
  }
}

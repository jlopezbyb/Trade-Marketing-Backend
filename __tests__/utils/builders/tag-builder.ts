import { faker } from "@faker-js/faker";
import { TagEntity, TagStatus } from "../../../src/contexts/parameters/core/entities/tag-entity";
import { TagModel } from "../../../src/contexts/shared/infrastructure/models/parameter/tag.model";

export class TagBuilder{
  private tagEntity: TagEntity;

  constructor() {
    this.tagEntity = this.createTagEntity({});
  }

  private createTagEntity({
    id = faker.string.uuid(),
    name = faker.lorem.word(),
    description = faker.lorem.word(),
    status = TagStatus.ACTIVE
  }: {
    id?: string;
    name?: string;
    description?: string;
    status?: TagStatus;
  }): TagEntity {
    return new TagEntity(
      id,
      name,
      description,
      status
    );
  }

  public withStatusInactive(): TagBuilder {
    this.tagEntity = TagEntity.fromPrimitives({...this.createTagEntity({}), status: TagStatus.INACTIVE});
    return this;
  }

  public async build(): Promise<TagEntity> {
    await TagModel.create(this.tagEntity.toPrimitives());
    return this.tagEntity;
  }
}

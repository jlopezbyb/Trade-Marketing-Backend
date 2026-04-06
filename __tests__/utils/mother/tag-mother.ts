import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';

import {
  TagEntity,
  TagStatus
} from '../../../src/contexts/parameters/core/entities/tag-entity';

export class TagMother {
  static createTagRequest({
    name = faker.lorem.word(),
    description = faker.lorem.word(),
    status = TagStatus.ACTIVE
  }: {
    name?: string;
    description?: string;
    status?: TagStatus;
  }) {
    return {
      name,
      description,
      status
    };
  }

  static createTagEntity(): TagEntity {
    return new TagEntity(
      uuid(),
      faker.lorem.word(),
      faker.lorem.word(),
      TagStatus.ACTIVE
    );
  }
}

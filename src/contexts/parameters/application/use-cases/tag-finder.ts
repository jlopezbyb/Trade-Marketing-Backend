import { TagRepository } from '@src/contexts/parameters/core/repositories/tag-repository';

export class TagFinder {
  constructor(private readonly tagRepository: TagRepository) {}

  async run(limit: number, page: number) {
    return this.tagRepository.getAll(limit, page);
  }
}

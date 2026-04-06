import { TagRepository } from '../../src/parameters/core/repositories/tag-repository';

export const mocksTagRepository: jest.Mocked<TagRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn().mockReturnValue({}),
  getAll: jest.fn().mockReturnValue([]),
  getDetailTagsWithAssignment: jest.fn(),
  getTagsByIds: jest.fn().mockReturnValue([])
};

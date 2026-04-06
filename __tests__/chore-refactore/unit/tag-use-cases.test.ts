import { mocksTagRepository } from "../__mocks__/tag-mocks";
import { CreateTag } from '../../src/parameters/application/use-cases/create-tag';
import { UpdateTag } from '../../src/parameters/application/use-cases/update-tag';
import { DeleteTag } from '../../src/parameters/application/use-cases/delete-tag';
import { TagFinderById } from '../../src/parameters/application/use-cases/tag-finder-by-id';
import { TagFinder } from '../../src/parameters/application/use-cases/tag-finder';

import { TagMother } from "../mother/tag-mother";

describe('TAG: Use Cases', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('should create a new tag', async () => {
    const tag = TagMother.createTag();
    const createTag = new CreateTag(mocksTagRepository);
    await createTag.run(tag);
    expect(mocksTagRepository.create).toHaveBeenCalledWith(tag);
  });

  it('should update a tag and throw an error if tag not found', async () => {
    const tag = TagMother.createTag();
    const updateTag = new UpdateTag(mocksTagRepository);
    await updateTag.run(tag);
    expect(mocksTagRepository.update).toHaveBeenCalledWith(tag);
    mocksTagRepository.getById.mockResolvedValueOnce(null);
    await expect(updateTag.run(tag)).rejects.toThrow('Tag not found');
  });

  it('should delete a tag and throw an error if tag not found', async () => {
    const tag = TagMother.createTag();
    const deleteTag = new DeleteTag(mocksTagRepository);
    await deleteTag.run(tag.id);
    expect(mocksTagRepository.delete).toHaveBeenCalledWith(tag.id);

    mocksTagRepository.getById.mockResolvedValueOnce(null);
    await expect(deleteTag.run(tag.id)).rejects.toThrow('Tag not found');
  });

  it('should find a tag by id and throw an error if tag not found', async () => {
    const tag = TagMother.createTag();
    const tagFinderById = new TagFinderById(mocksTagRepository);
    await tagFinderById.run(tag.id);
    expect(mocksTagRepository.getById).toHaveBeenCalledWith(tag.id);

    mocksTagRepository.getById.mockResolvedValueOnce(null);
    await expect(tagFinderById.run(tag.id)).rejects.toThrow('Tag not found');
  });

  it('should find all tags', async () => {
    const tagFinder = new TagFinder(mocksTagRepository);
    await tagFinder.run(1, 2);
    expect(mocksTagRepository.getAll).toHaveBeenCalled();
  });
});

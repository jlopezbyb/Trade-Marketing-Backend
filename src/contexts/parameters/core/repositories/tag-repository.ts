import { TagEntity as Tag } from '../entities/tag-entity';
//import { TagAssignmentDetailEntity } from '../../../assignment/core/entities/tag-assignment-detail-entity';

export interface TagRepository {
  create(tag: { name: string; description: string; status: 'ACTIVO' | 'INACTIVO' }): Promise<void>;
  update(tag: { id: string; name: string; description: string; status: 'ACTIVO' | 'INACTIVO' }): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Tag | null>;
  getAll(limit: number, page: number): Promise<{ data: Tag[]; pageCounter: number }>;
  //getDetailTagsWithAssignment(tagId: string): Promise<TagAssignmentDetailEntity | null>;
  getTagsByIds(ids: string[]): Promise<Tag[] | []>;
}

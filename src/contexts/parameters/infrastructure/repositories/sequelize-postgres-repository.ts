import { v4 as uuid } from 'uuid';
import { Op } from 'sequelize';

import { TagRepository } from '@src/contexts/parameters/core/repositories/tag-repository';
import { TagModel } from '@src/contexts/shared/infrastructure/models/parameter/tag.model';
import { TagEntity } from '@src/contexts/parameters/core/entities/tag-entity';
//import { TagAssignmentDetailEntity } from '@src/contexts/assignment/core/entities/tag-assignment-detail-entity';

export class SequelizePostgresRepository implements TagRepository {
  async create(tag: { name: string; description: string; status: 'ACTIVO' | 'INACTIVO' }): Promise<void> {
    await TagModel.create({ ...tag, id: uuid() });
  }

  async update(tag: { id: string; name: string; description: string; status: 'ACTIVO' | 'INACTIVO' }): Promise<void> {
    await TagModel.update(tag, {
      where: { id: tag.id },
      fields: ['name', 'description', 'status']
    });
  }

  async delete(id: string): Promise<void> {
    await TagModel.destroy({ where: { id } });
  }

  async getById(id: string): Promise<TagEntity | null> {
    const tagDatabase = await TagModel.findByPk(id);
    return tagDatabase ? TagEntity.fromPrimitives(tagDatabase?.get({ plain: true })) : null;
  }

  async getAll(limit: number = 20, page: number = 1): Promise<{ data: TagEntity[]; pageCounter: number }> {
    const tagsCounter = await TagModel.count();
    const allPages = Math.ceil(tagsCounter / limit);
    const offset = (page - 1) * limit;

    const tagsDatabase = await TagModel.findAll({ offset, limit });

    const tags = tagsDatabase.map(tag => TagEntity.fromPrimitives(tag.get({ plain: true })));

    return {
      data: tags,
      pageCounter: allPages
    };
  }

  // async getDetailTagsWithAssignment(tagId: string): Promise<TagAssignmentDetailEntity | null> {
  //   const tagDetailDatabase = await AssignmentTagDetailModel.findOne({
  //     where: { tag_id: tagId }
  //   });

  //   return tagDetailDatabase ? TagAssignmentDetailEntity.fromPrimitives(tagDetailDatabase?.get({ plain: true })) : null;
  // }

  async getTagsByIds(ids: string[]): Promise<TagEntity[] | []> {
    const tagsDatabase = await TagModel.findAll({
      where: { id: { [Op.in]: ids }, status: 'ACTIVO' }
    });

    if (tagsDatabase.length === 0) {
      return [];
    }

    return tagsDatabase.map(tag => TagEntity.fromPrimitives(tag.get({ plain: true })));
  }
}

import { TagRepository } from '@src/contexts/parameters/core/repositories/tag-repository';
import { AppError } from '@src/contexts/shared/infrastructure/exception/AppError';

export class UpdateTag {
  constructor(private readonly tagRepository: TagRepository) {}

  async run(data: { id: string; name: string; description: string; status: 'ACTIVO' | 'INACTIVO' }) {
    const tag = await this.tagRepository.getById(data.id);

    if (!tag) {
      throw new AppError('TAG_NOT_FOUND', 404, 'Tag not found', true);
    }

    // Validación: no permitir pasar a INACTIVO si hay asignaciones activas
    if (data.status === 'INACTIVO') {
      //const tagWithAssignmentRelation = await this.tagRepository.getDetailTagsWithAssignment(data.id);
      //   if (tagWithAssignmentRelation) {
      //     throw new AppError('TAG_NOT_INACTIVABLE', 400, 'You cannot inactivate a tag that has active assignments', true);
      //   }
    }

    return this.tagRepository.update(data);
  }
}

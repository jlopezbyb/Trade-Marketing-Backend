export class ResourceEntity {
  readonly id: string;
  readonly slug: string;
  readonly description: string;

  constructor(id: string, slug: string, description: string) {
    this.id = id;
    this.slug = slug;
    this.description = description;
  }

  static fromPrimitives(plainData: { id: string; slug: string; description: string }): ResourceEntity {
    return new ResourceEntity(plainData.id, plainData.slug, plainData.description);
  }

  toPrimitives() {
    return {
      id: this.id,
      slug: this.slug,
      description: this.description
    };
  }
}

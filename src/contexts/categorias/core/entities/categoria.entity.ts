export class CategoriaEntity {
  constructor(
    readonly id: number,
    readonly nombre: string,
    readonly descripcion: string | null,
    readonly color: string | null,
    readonly activo: boolean
  ) {}

  static fromPrimitives(data: any): CategoriaEntity {
    return new CategoriaEntity(data.id, data.nombre, data.descripcion, data.color, data.activo);
  }

  toPrimitives() {
    return { id: this.id, nombre: this.nombre, descripcion: this.descripcion, color: this.color, activo: this.activo };
  }
}

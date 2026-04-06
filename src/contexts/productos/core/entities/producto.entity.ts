export class ProductoEntity {
  constructor(
    readonly id: number,
    readonly nombre: string,
    readonly sku: string,
    readonly unidad: string,
    readonly categoria_id: number,
    readonly imagen_url: string | null,
    readonly activo: boolean,
    readonly categoria?: { id: number; nombre: string; color: string | null }
  ) {}

  static fromPrimitives(data: any): ProductoEntity {
    return new ProductoEntity(
      data.id,
      data.nombre,
      data.sku,
      data.unidad,
      data.categoria_id,
      data.imagen_url,
      data.activo,
      data.categoria
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      nombre: this.nombre,
      sku: this.sku,
      unidad: this.unidad,
      categoria_id: this.categoria_id,
      imagen_url: this.imagen_url,
      activo: this.activo,
      categoria: this.categoria
    };
  }
}

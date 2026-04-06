export class InventarioEntity {
  constructor(
    readonly id: number,
    readonly cliente_id: number,
    readonly producto_id: number,
    readonly cantidad: number,
    readonly fecha_actualizacion: string,
    readonly cliente?: { id: number; nombre: string },
    readonly producto?: { id: number; nombre: string; sku: string }
  ) {}

  static fromPrimitives(data: any): InventarioEntity {
    return new InventarioEntity(
      data.id,
      data.cliente_id,
      data.producto_id,
      data.cantidad,
      data.fecha_actualizacion,
      data.cliente,
      data.producto
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      cliente_id: this.cliente_id,
      producto_id: this.producto_id,
      cantidad: this.cantidad,
      fecha_actualizacion: this.fecha_actualizacion,
      cliente: this.cliente,
      producto: this.producto
    };
  }
}

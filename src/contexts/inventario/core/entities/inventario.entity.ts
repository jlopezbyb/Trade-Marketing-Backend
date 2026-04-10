export class InventarioEntity {
  constructor(
    readonly id: string,
    readonly cliente_id: string,
    readonly producto_id: string,
    readonly cantidad: number,
    readonly fecha_actualizacion: string,
    readonly cliente?: { id: string; nombre: string },
    readonly producto?: { id: string; nombre: string; sku: string }
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

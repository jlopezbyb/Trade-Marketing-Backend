export class VisitaEntity {
  constructor(
    readonly id: string,
    readonly cliente_id: string,
    readonly usuario_id: string,
    readonly fecha: string,
    readonly observaciones: string | null,
    readonly created_at?: Date,
    readonly cliente?: { id: string; nombre: string },
    readonly usuario?: { id: string; nombre: string }
  ) {}

  static fromPrimitives(data: any): VisitaEntity {
    return new VisitaEntity(
      data.id,
      data.cliente_id,
      data.usuario_id,
      data.fecha,
      data.observaciones,
      data.created_at,
      data.cliente,
      data.usuario
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      cliente_id: this.cliente_id,
      usuario_id: this.usuario_id,
      fecha: this.fecha,
      observaciones: this.observaciones,
      cliente: this.cliente,
      usuario: this.usuario
    };
  }
}

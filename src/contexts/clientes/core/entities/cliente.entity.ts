export class ClienteEntity {
  constructor(
    readonly id: string,
    readonly nombre: string,
    readonly cliente_code: string,
    readonly direccion: string,
    readonly telefono: string,
    readonly contacto: string,
    readonly email: string | null,
    readonly imagen_url: string | null,
    readonly activo: boolean,
    readonly created_at?: Date,
    readonly updated_at?: Date
  ) {}

  static fromPrimitives(data: any): ClienteEntity {
    return new ClienteEntity(
      data.id,
      data.nombre,
      data.cliente_code,
      data.direccion,
      data.telefono,
      data.contacto,
      data.email,
      data.imagen_url,
      data.activo,
      data.created_at,
      data.updated_at
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      nombre: this.nombre,
      cliente_code: this.cliente_code,
      direccion: this.direccion,
      telefono: this.telefono,
      contacto: this.contacto,
      email: this.email,
      imagen_url: this.imagen_url,
      activo: this.activo
    };
  }
}

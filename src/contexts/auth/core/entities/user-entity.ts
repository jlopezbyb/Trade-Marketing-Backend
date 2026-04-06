export type UserRol = 'field' | 'supervisor';

export class UserEntity {
  readonly id: number;
  readonly email: string;
  readonly employee_code: string;
  readonly nombre: string;
  readonly rol: UserRol;
  readonly activo: boolean;
  readonly imagen_url?: string | null;

  constructor(
    id: number,
    email: string,
    employee_code: string,
    nombre: string,
    rol: UserRol,
    activo: boolean,
    imagen_url?: string | null
  ) {
    this.id = id;
    this.email = email;
    this.employee_code = employee_code;
    this.nombre = nombre;
    this.rol = rol;
    this.activo = activo;
    this.imagen_url = imagen_url;
  }

  static fromPrimitives(plainData: {
    id: number;
    email: string;
    employee_code: string;
    nombre: string;
    rol: UserRol;
    activo: boolean;
    imagen_url?: string | null;
  }): UserEntity {
    return new UserEntity(
      plainData.id,
      plainData.email,
      plainData.employee_code,
      plainData.nombre,
      plainData.rol,
      plainData.activo,
      plainData.imagen_url
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      email: this.email,
      employee_code: this.employee_code,
      nombre: this.nombre,
      rol: this.rol,
      activo: this.activo,
      imagen_url: this.imagen_url
    };
  }
}

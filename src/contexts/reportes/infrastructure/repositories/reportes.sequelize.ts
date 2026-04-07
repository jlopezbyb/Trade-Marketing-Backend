import { sequelize } from '@src/server/config/database/sequelize';
import { QueryTypes } from 'sequelize';

export class ReportesSequelizeRepository {
  async getInventarioEstancado(limit: number, page: number) {
    const offset = (page - 1) * limit;
    const [countResult] = await sequelize.query<{ total: string }>('SELECT COUNT(*) as total FROM vw_inventario_estancado', {
      type: QueryTypes.SELECT
    });
    const data = await sequelize.query(
      `SELECT
        id,
        cliente_id,
        cliente_nombre,
        producto_id,
        producto_nombre,
        cantidad,
        fecha_actualizacion,
        (CURRENT_DATE - fecha_actualizacion) AS dias_sin_movimiento
      FROM vw_inventario_estancado
      ORDER BY (CURRENT_DATE - fecha_actualizacion) DESC
      LIMIT :limit OFFSET :offset`,
      { replacements: { limit, offset }, type: QueryTypes.SELECT }
    );
    return { data, total: Number(countResult?.total ?? 0) };
  }

  async getProductosPorVencer(limit: number, page: number) {
    const offset = (page - 1) * limit;
    const [countResult] = await sequelize.query<{ total: string }>('SELECT COUNT(*) as total FROM vw_productos_por_vencer', {
      type: QueryTypes.SELECT
    });
    const data = await sequelize.query<{ total: string }>(
      'SELECT * FROM vw_productos_por_vencer ORDER BY dias_para_vencer ASC LIMIT :limit OFFSET :offset',
      { replacements: { limit, offset }, type: QueryTypes.SELECT }
    );
    return { data, total: Number(countResult?.total ?? 0) };
  }

  async getSummary() {
    const [[clientes], [productos], [visitas], [inventario]] = await Promise.all([
      sequelize.query('SELECT COUNT(*) as total FROM clientes WHERE activo = true', { type: QueryTypes.SELECT }) as any,
      sequelize.query('SELECT COUNT(*) as total FROM productos WHERE activo = true', { type: QueryTypes.SELECT }) as any,
      sequelize.query("SELECT COUNT(*) as total FROM visitas WHERE fecha >= CURRENT_DATE - INTERVAL '30 days'", {
        type: QueryTypes.SELECT
      }) as any,
      sequelize.query('SELECT COUNT(*) as total FROM inventario', { type: QueryTypes.SELECT }) as any
    ]);
    return {
      clientes_activos: Number(clientes?.total ?? 0),
      productos_activos: Number(productos?.total ?? 0),
      visitas_ultimo_mes: Number(visitas?.total ?? 0),
      registros_inventario: Number(inventario?.total ?? 0)
    };
  }
}

import { UserModel } from '../auth/user.model';
import { ClienteModel } from './cliente.model';
import { CategoriaModel } from './categoria.model';
import { ProductoModel } from './producto.model';
import { VisitaModel } from './visita.model';
import { InventarioModel } from './inventario.model';
import { InventarioLoteModel } from './inventario-lote.model';
import { UsuarioClienteModel } from './usuario-cliente.model';

// Producto -> Categoria
CategoriaModel.hasMany(ProductoModel, { foreignKey: 'categoria_id' });
ProductoModel.belongsTo(CategoriaModel, { foreignKey: 'categoria_id', as: 'categoria' });

// Visita -> Cliente, Usuario
ClienteModel.hasMany(VisitaModel, { foreignKey: 'cliente_id' });
VisitaModel.belongsTo(ClienteModel, { foreignKey: 'cliente_id', as: 'cliente' });
UserModel.hasMany(VisitaModel, { foreignKey: 'usuario_id' });
VisitaModel.belongsTo(UserModel, { foreignKey: 'usuario_id', as: 'usuario' });

// Inventario -> Cliente, Producto
ClienteModel.hasMany(InventarioModel, { foreignKey: 'cliente_id' });
InventarioModel.belongsTo(ClienteModel, { foreignKey: 'cliente_id', as: 'cliente' });
ProductoModel.hasMany(InventarioModel, { foreignKey: 'producto_id' });
InventarioModel.belongsTo(ProductoModel, { foreignKey: 'producto_id', as: 'producto' });

// InventarioLote -> Inventario
InventarioModel.hasMany(InventarioLoteModel, { foreignKey: 'inventario_id', as: 'lotes' });
InventarioLoteModel.belongsTo(InventarioModel, { foreignKey: 'inventario_id' });

// Usuario <-> Cliente (many-to-many)
UserModel.belongsToMany(ClienteModel, { through: UsuarioClienteModel, foreignKey: 'usuario_id', as: 'clientes' });
ClienteModel.belongsToMany(UserModel, { through: UsuarioClienteModel, foreignKey: 'cliente_id', as: 'usuarios' });

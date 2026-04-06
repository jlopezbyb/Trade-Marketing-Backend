-- =========================================================
-- INIT SQL - Trade Marketing (PostgreSQL, idempotente)
-- Este script se ejecuta sobre la base definida en POSTGRES_DB.
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- TABLAS
-- =========================================================

CREATE TABLE IF NOT EXISTS usuarios (
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	nombre VARCHAR(150) NOT NULL,
	rol VARCHAR(20) NOT NULL CHECK (rol IN ('field', 'supervisor')),
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	imagen_url TEXT,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientes (
	id BIGSERIAL PRIMARY KEY,
	nombre VARCHAR(180) NOT NULL,
	direccion VARCHAR(255) NOT NULL,
	telefono VARCHAR(30) NOT NULL,
	contacto VARCHAR(150) NOT NULL,
	email VARCHAR(255),
	imagen_url TEXT,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuario_cliente_asignado (
	usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
	cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY (usuario_id, cliente_id)
);

CREATE TABLE IF NOT EXISTS categorias (
	id BIGSERIAL PRIMARY KEY,
	nombre VARCHAR(120) NOT NULL UNIQUE,
	descripcion TEXT,
	color VARCHAR(20) NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS productos (
	id BIGSERIAL PRIMARY KEY,
	nombre VARCHAR(180) NOT NULL,
	sku VARCHAR(80) NOT NULL UNIQUE,
	unidad VARCHAR(40) NOT NULL,
	categoria_id BIGINT REFERENCES categorias(id) ON DELETE SET NULL,
	imagen_url TEXT,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visitas (
	id BIGSERIAL PRIMARY KEY,
	cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
	usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
	fecha DATE NOT NULL,
	observaciones TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventario (
	id BIGSERIAL PRIMARY KEY,
	cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
	producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
	cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
	fecha_actualizacion DATE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	UNIQUE (cliente_id, producto_id)
);

CREATE TABLE IF NOT EXISTS inventario_lotes (
	id BIGSERIAL PRIMARY KEY,
	inventario_id BIGINT NOT NULL REFERENCES inventario(id) ON DELETE CASCADE,
	lote VARCHAR(80) NOT NULL,
	cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
	fecha_vencimiento DATE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	UNIQUE (inventario_id, lote)
);

-- =========================================================
-- INDICES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_visitas_cliente_fecha ON visitas (cliente_id, fecha DESC);
CREATE INDEX IF NOT EXISTS idx_visitas_usuario_fecha ON visitas (usuario_id, fecha DESC);

CREATE INDEX IF NOT EXISTS idx_inventario_cliente ON inventario (cliente_id);
CREATE INDEX IF NOT EXISTS idx_inventario_producto ON inventario (producto_id);
CREATE INDEX IF NOT EXISTS idx_inventario_fecha_actualizacion ON inventario (fecha_actualizacion);

CREATE INDEX IF NOT EXISTS idx_lotes_vencimiento ON inventario_lotes (fecha_vencimiento);

-- =========================================================
-- TRIGGERS updated_at
-- =========================================================

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'trg_usuarios_updated_at'
			AND tgrelid = 'usuarios'::regclass
	) THEN
		CREATE TRIGGER trg_usuarios_updated_at
		BEFORE UPDATE ON usuarios
		FOR EACH ROW
		EXECUTE FUNCTION set_updated_at();
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'trg_clientes_updated_at'
			AND tgrelid = 'clientes'::regclass
	) THEN
		CREATE TRIGGER trg_clientes_updated_at
		BEFORE UPDATE ON clientes
		FOR EACH ROW
		EXECUTE FUNCTION set_updated_at();
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'trg_categorias_updated_at'
			AND tgrelid = 'categorias'::regclass
	) THEN
		CREATE TRIGGER trg_categorias_updated_at
		BEFORE UPDATE ON categorias
		FOR EACH ROW
		EXECUTE FUNCTION set_updated_at();
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'trg_productos_updated_at'
			AND tgrelid = 'productos'::regclass
	) THEN
		CREATE TRIGGER trg_productos_updated_at
		BEFORE UPDATE ON productos
		FOR EACH ROW
		EXECUTE FUNCTION set_updated_at();
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'trg_inventario_updated_at'
			AND tgrelid = 'inventario'::regclass
	) THEN
		CREATE TRIGGER trg_inventario_updated_at
		BEFORE UPDATE ON inventario
		FOR EACH ROW
		EXECUTE FUNCTION set_updated_at();
	END IF;
END $$;

-- =========================================================
-- VISTAS DE REPORTES
-- =========================================================

CREATE OR REPLACE VIEW vw_inventario_estancado AS
SELECT
	i.id,
	i.cliente_id,
	c.nombre AS cliente_nombre,
	i.producto_id,
	p.nombre AS producto_nombre,
	i.cantidad,
	i.fecha_actualizacion,
	(CURRENT_DATE - i.fecha_actualizacion) AS dias_sin_cambio
FROM inventario i
JOIN clientes c ON c.id = i.cliente_id
JOIN productos p ON p.id = i.producto_id;

CREATE OR REPLACE VIEW vw_productos_por_vencer AS
SELECT
	l.id,
	i.cliente_id,
	c.nombre AS cliente_nombre,
	i.producto_id,
	p.nombre AS producto_nombre,
	l.lote,
	l.cantidad,
	l.fecha_vencimiento,
	(l.fecha_vencimiento - CURRENT_DATE) AS dias_para_vencer,
	CASE
		WHEN (l.fecha_vencimiento - CURRENT_DATE) BETWEEN 0 AND 7 THEN 'critico'
		WHEN (l.fecha_vencimiento - CURRENT_DATE) BETWEEN 8 AND 15 THEN 'alerta'
		WHEN (l.fecha_vencimiento - CURRENT_DATE) BETWEEN 16 AND 30 THEN 'proximo'
		ELSE 'fuera_rango'
	END AS estado
FROM inventario_lotes l
JOIN inventario i ON i.id = l.inventario_id
JOIN clientes c ON c.id = i.cliente_id
JOIN productos p ON p.id = i.producto_id;
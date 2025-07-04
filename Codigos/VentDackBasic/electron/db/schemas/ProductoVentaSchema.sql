CREATE TABLE IF NOT EXISTS producto_venta (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  codigo TEXT,
  cantidad INTEGER NOT NULL,
  precio REAL NOT NULL,
  descripcion TEXT,
  url_img TEXT
);

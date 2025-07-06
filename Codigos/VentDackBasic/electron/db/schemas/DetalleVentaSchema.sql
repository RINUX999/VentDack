CREATE TABLE IF NOT EXISTS detalle_venta (
  id TEXT PRIMARY KEY,
  venta_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  codigo TEXT NOT NULL,
  cantidad INTEGER NOT NULL,
  subtotal REAL NOT NULL,

  FOREIGN KEY (venta_id) REFERENCES venta(id)
);

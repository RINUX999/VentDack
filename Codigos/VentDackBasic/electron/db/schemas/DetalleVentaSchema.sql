CREATE TABLE IF NOT EXISTS detalle_venta (
  id TEXT PRIMARY KEY,
  venta_id TEXT NOT NULL,
  producto_id TEXT NOT NULL,
  nombre TEXT NOT NULL,
  codigo TEXT,
  cantidad INTEGER NOT NULL,
  subtotal REAL NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES venta(id),
  FOREIGN KEY (producto_id) REFERENCES producto(id)
);
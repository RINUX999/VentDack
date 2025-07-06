CREATE TABLE IF NOT EXISTS venta (
  id TEXT PRIMARY KEY,         -- UUID o similar 
  fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total REAL NOT NULL,
  cantidad_total INTEGER NOT NULL DEFAULT 0  -- nueva columna para la cantidad total de productos
);

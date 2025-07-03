import db from './db';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  creado_en: string;
}

export function obtenerProductos(): Promise<Producto[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM productos ORDER BY creado_en DESC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows as Producto[]);
    });
  });
}

export function insertarProducto(nombre: string, precio: number): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

import db from '../db';
import type ProductoVenta  from '../models/ProductoVenta';

/** Crear un nuevo producto */
export function crearProducto(producto: ProductoVenta): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      `INSERT INTO producto_venta (id, nombre, codigo, cantidad, precio, descripcion, url_img)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    stmt.run(
      producto.id,
      producto.nombre,
      producto.codigo,
      producto.cantidad,
      producto.precio,
      producto.descripcion,
      producto.url_img,
      (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      }
    );
    stmt.finalize();
  });
}

/** Editar un producto por su ID */
export function editarProducto(producto: ProductoVenta): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      `UPDATE producto_venta SET
        nombre = ?,
        codigo = ?,
        cantidad = ?,
        precio = ?,
        descripcion = ?,
        url_img = ?
       WHERE id = ?`
    );
    stmt.run(
      producto.nombre,
      producto.codigo,
      producto.cantidad,
      producto.precio,
      producto.descripcion,
      producto.url_img,
      producto.id,
      (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      }
    );
    stmt.finalize();
  });
}

/** Obtener un producto por su ID */
export function obtenerProductoPorId(id: string): Promise<ProductoVenta | null> {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM producto_venta WHERE id = ?`,
      [id],
      (err: Error | null, row: any) => {
        if (err) reject(err);
        else resolve(row ? (row as ProductoVenta) : null);
      }
    );
  });
}

/** Obtener todos los productos */
export function obtenerTodosLosProductos(): Promise<ProductoVenta[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM producto_venta`,
      (err: Error | null, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows as ProductoVenta[]);
      }
    );
  });
}

/** Eliminar un producto por ID */
export function eliminarProducto(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM producto_venta WHERE id = ?`,
      [id],
      (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/** Eliminar varios productos por sus IDs */
export function eliminarProductos(ids: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const placeholders = ids.map(() => '?').join(', ');
    db.run(
      `DELETE FROM producto_venta WHERE id IN (${placeholders})`,
      ids,
      (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

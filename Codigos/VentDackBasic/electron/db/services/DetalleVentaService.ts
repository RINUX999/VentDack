import db from '../db';
import type DetalleVenta from '../models/DetalleVenta';

export function crearDetalleVenta(detalle: DetalleVenta): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO detalle_venta (id, venta_id, producto_id, nombre, codigo, cantidad, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      detalle.id,
      detalle.venta_id,
      detalle.producto_id,
      detalle.nombre,
      detalle.codigo,
      detalle.cantidad,
      detalle.subtotal,
      (err: Error | null) => (err ? reject(err) : resolve())
    );
    stmt.finalize();
  });
}

export function obtenerDetallesPorVentaId(ventaId: string): Promise<DetalleVenta[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM detalle_venta WHERE venta_id = ?`,
      [ventaId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as DetalleVenta[]);
      }
    );
  });
}

export function eliminarDetalleVenta(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`DELETE FROM detalle_venta WHERE id = ?`);
    stmt.run(id, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
    stmt.finalize();
  });
}

export function obtenerDetalles(): Promise<DetalleVenta[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM detalle_venta`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as DetalleVenta[]);
      }
    );
  });
}
import db from '../db';
import type DetalleVenta from '../models/DetalleVenta';

/** Crear un nuevo detalle de venta */
export function crearDetalleVenta(detalle: DetalleVenta): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO detalle_venta (id, venta_id, producto_id, cantidad, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      detalle.id,
      detalle.venta_id,
      detalle.producto_id,
      detalle.cantidad,
      detalle.subtotal,
      (err: Error | null) => (err ? reject(err) : resolve())
    );
    stmt.finalize();
  });
}

/** Obtener detalles por ID de venta */
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

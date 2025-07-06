import db from '../db';
import type Venta from '../models/Venta';

/** Crear una nueva venta */
export function crearVenta(venta: Venta): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO venta (id, fecha, total, cantidad_total)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(
      venta.id,
      venta.fecha,
      venta.total,
      venta.cantidad_total,
      (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      }
    );
    stmt.finalize();
  });
}

/** Obtener todas las ventas */
export function obtenerTodasLasVentas(): Promise<Venta[]> {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM venta`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as Venta[]);
    });
  });
}

/** Obtener una venta por ID */
export function obtenerVentaPorId(id: string): Promise<Venta | null> {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM venta WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row ? (row as Venta) : null);
    });
  });
}

/** Eliminar una venta por ID */
export function eliminarVenta(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`DELETE FROM venta WHERE id = ?`);
    stmt.run(id, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
    stmt.finalize();
  });
}

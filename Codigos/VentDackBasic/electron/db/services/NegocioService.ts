import db from "../db";
import type { Negocio } from "../models/Negocio";

// Obtener el negocio (único)
export function obtenerNegocio(): Promise<Negocio | null> {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM negocio LIMIT 1`, [], (err, row) => {
      if (err) return reject(err);

      if (!row) return resolve(null);

      const negocio: Negocio = {
        id: (row as any).id,
        nombre: (row as any).nombre
      };

      resolve(negocio);
    });
  });
}

// Guardar negocio: inserta si no hay, actualiza si ya existe
export function guardarNegocio(nombre: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id FROM negocio LIMIT 1`, [], (err, row) => {
      if (err) return reject(err);

      const idFijo = "negocio_unico";

      if (row && (row as any).id) {
        const stmt = db.prepare(`UPDATE negocio SET nombre = ? WHERE id = ?`);
        stmt.run(nombre, (row as any).id, (err: Error | null) => (err ? reject(err) : resolve()));
        stmt.finalize();
      } else {
        const stmt = db.prepare(`INSERT INTO negocio (id, nombre) VALUES (?, ?)`);
        stmt.run(idFijo, nombre, (err: Error | null) => (err ? reject(err) : resolve()));
        stmt.finalize();
      }
    });
  });
}

// Editar negocio (si ya sabes el ID)
export function editarNegocio(id: string, nuevoNombre: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`UPDATE negocio SET nombre = ? WHERE id = ?`);
    stmt.run(nuevoNombre, id, (err: Error | null) => (err ? reject(err) : resolve()));
    stmt.finalize();
  });
}

// Eliminar negocio
export function eliminarNegocio(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`DELETE FROM negocio WHERE id = ?`);
    stmt.run(id, (err: Error | null) => (err ? reject(err) : resolve()));
    stmt.finalize();
  });
}

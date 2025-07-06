"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerNegocio = obtenerNegocio;
exports.guardarNegocio = guardarNegocio;
exports.editarNegocio = editarNegocio;
exports.eliminarNegocio = eliminarNegocio;
const db_1 = __importDefault(require("../db"));
// Obtener el negocio (único)
function obtenerNegocio() {
    return new Promise((resolve, reject) => {
        db_1.default.get(`SELECT * FROM negocio LIMIT 1`, [], (err, row) => {
            if (err)
                return reject(err);
            if (!row)
                return resolve(null);
            const negocio = {
                id: row.id,
                nombre: row.nombre
            };
            resolve(negocio);
        });
    });
}
// Guardar negocio: inserta si no hay, actualiza si ya existe
function guardarNegocio(nombre) {
    return new Promise((resolve, reject) => {
        db_1.default.get(`SELECT id FROM negocio LIMIT 1`, [], (err, row) => {
            if (err)
                return reject(err);
            const idFijo = "negocio_unico";
            if (row && row.id) {
                const stmt = db_1.default.prepare(`UPDATE negocio SET nombre = ? WHERE id = ?`);
                stmt.run(nombre, row.id, (err) => (err ? reject(err) : resolve()));
                stmt.finalize();
            }
            else {
                const stmt = db_1.default.prepare(`INSERT INTO negocio (id, nombre) VALUES (?, ?)`);
                stmt.run(idFijo, nombre, (err) => (err ? reject(err) : resolve()));
                stmt.finalize();
            }
        });
    });
}
// Editar negocio (si ya sabes el ID)
function editarNegocio(id, nuevoNombre) {
    return new Promise((resolve, reject) => {
        const stmt = db_1.default.prepare(`UPDATE negocio SET nombre = ? WHERE id = ?`);
        stmt.run(nuevoNombre, id, (err) => (err ? reject(err) : resolve()));
        stmt.finalize();
    });
}
// Eliminar negocio
function eliminarNegocio(id) {
    return new Promise((resolve, reject) => {
        const stmt = db_1.default.prepare(`DELETE FROM negocio WHERE id = ?`);
        stmt.run(id, (err) => (err ? reject(err) : resolve()));
        stmt.finalize();
    });
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearVenta = crearVenta;
exports.obtenerTodasLasVentas = obtenerTodasLasVentas;
exports.obtenerVentaPorId = obtenerVentaPorId;
exports.eliminarVenta = eliminarVenta;
const db_1 = __importDefault(require("../db"));
/** Crear una nueva venta */
function crearVenta(venta) {
    return new Promise((resolve, reject) => {
        const stmt = db_1.default.prepare(`
      INSERT INTO venta (id, fecha, total, cantidad_total)
      VALUES (?, ?, ?, ?)
    `);
        stmt.run(venta.id, venta.fecha, venta.total, venta.cantidad_total, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
        stmt.finalize();
    });
}
/** Obtener todas las ventas */
function obtenerTodasLasVentas() {
    return new Promise((resolve, reject) => {
        db_1.default.all(`SELECT * FROM venta`, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}
/** Obtener una venta por ID */
function obtenerVentaPorId(id) {
    return new Promise((resolve, reject) => {
        db_1.default.get(`SELECT * FROM venta WHERE id = ?`, [id], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row ? row : null);
        });
    });
}
/** Eliminar una venta por ID */
function eliminarVenta(id) {
    return new Promise((resolve, reject) => {
        const stmt = db_1.default.prepare(`DELETE FROM venta WHERE id = ?`);
        stmt.run(id, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
        stmt.finalize();
    });
}

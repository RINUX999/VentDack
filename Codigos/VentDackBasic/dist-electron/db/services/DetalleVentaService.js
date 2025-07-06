"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearDetalleVenta = crearDetalleVenta;
exports.obtenerDetallesPorVentaId = obtenerDetallesPorVentaId;
exports.eliminarDetalleVenta = eliminarDetalleVenta;
exports.obtenerDetalles = obtenerDetalles;
const db_1 = __importDefault(require("../db"));
function crearDetalleVenta(detalle) {
    return new Promise((resolve, reject) => {
        const stmt = db_1.default.prepare(`
      INSERT INTO detalle_venta (id, venta_id, producto_id, nombre, codigo, cantidad, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(detalle.id, detalle.venta_id, detalle.producto_id, detalle.nombre, detalle.codigo, detalle.cantidad, detalle.subtotal, (err) => (err ? reject(err) : resolve()));
        stmt.finalize();
    });
}
function obtenerDetallesPorVentaId(ventaId) {
    return new Promise((resolve, reject) => {
        db_1.default.all(`SELECT * FROM detalle_venta WHERE venta_id = ?`, [ventaId], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}
function eliminarDetalleVenta(id) {
    return new Promise((resolve, reject) => {
        const stmt = db_1.default.prepare(`DELETE FROM detalle_venta WHERE id = ?`);
        stmt.run(id, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
        stmt.finalize();
    });
}
function obtenerDetalles() {
    return new Promise((resolve, reject) => {
        db_1.default.all(`SELECT * FROM detalle_venta`, [], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

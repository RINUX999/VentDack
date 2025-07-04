"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearProducto = crearProducto;
exports.editarProducto = editarProducto;
exports.obtenerProductoPorId = obtenerProductoPorId;
exports.obtenerTodosLosProductos = obtenerTodosLosProductos;
exports.eliminarProducto = eliminarProducto;
exports.eliminarProductos = eliminarProductos;
const db_1 = __importDefault(require("../db"));
/** Crear un nuevo producto */
function crearProducto(producto) {
    return new Promise((resolve, reject) => {
        const stmt = db_1.default.prepare(`INSERT INTO producto_venta (id, nombre, codigo, cantidad, precio, descripcion, url_img)
       VALUES (?, ?, ?, ?, ?, ?, ?)`);
        stmt.run(producto.id, producto.nombre, producto.codigo, producto.cantidad, producto.precio, producto.descripcion, producto.url_img, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
        stmt.finalize();
    });
}
/** Editar un producto por su ID */
function editarProducto(producto) {
    return new Promise((resolve, reject) => {
        const stmt = db_1.default.prepare(`UPDATE producto_venta SET
        nombre = ?,
        codigo = ?,
        cantidad = ?,
        precio = ?,
        descripcion = ?,
        url_img = ?
       WHERE id = ?`);
        stmt.run(producto.nombre, producto.codigo, producto.cantidad, producto.precio, producto.descripcion, producto.url_img, producto.id, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
        stmt.finalize();
    });
}
/** Obtener un producto por su ID */
function obtenerProductoPorId(id) {
    return new Promise((resolve, reject) => {
        db_1.default.get(`SELECT * FROM producto_venta WHERE id = ?`, [id], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row ? row : null);
        });
    });
}
/** Obtener todos los productos */
function obtenerTodosLosProductos() {
    return new Promise((resolve, reject) => {
        db_1.default.all(`SELECT * FROM producto_venta`, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}
/** Eliminar un producto por ID */
function eliminarProducto(id) {
    return new Promise((resolve, reject) => {
        db_1.default.run(`DELETE FROM producto_venta WHERE id = ?`, [id], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
/** Eliminar varios productos por sus IDs */
function eliminarProductos(ids) {
    return new Promise((resolve, reject) => {
        const placeholders = ids.map(() => '?').join(', ');
        db_1.default.run(`DELETE FROM producto_venta WHERE id IN (${placeholders})`, ids, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}

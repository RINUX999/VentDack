"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerProductos = obtenerProductos;
exports.insertarProducto = insertarProducto;
const db_1 = __importDefault(require("./db"));
function obtenerProductos() {
    return new Promise((resolve, reject) => {
        db_1.default.all('SELECT * FROM productos ORDER BY creado_en DESC', [], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}
function insertarProducto(nombre, precio) {
    return new Promise((resolve, reject) => {
        db_1.default.run('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}

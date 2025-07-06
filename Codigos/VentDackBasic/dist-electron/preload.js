"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
    // Productos
    obtenerProductos: () => electron_1.ipcRenderer.invoke("producto:obtenerTodos"),
    obtenerProductoPorId: (id) => electron_1.ipcRenderer.invoke("producto:obtenerPorId", id),
    crearProducto: (producto) => electron_1.ipcRenderer.invoke("producto:crear", producto),
    editarProducto: (producto) => electron_1.ipcRenderer.invoke("producto:editar", producto),
    eliminarProducto: (id) => electron_1.ipcRenderer.invoke("producto:eliminar", id),
    eliminarProductos: (ids) => electron_1.ipcRenderer.invoke("producto:eliminarVarios", ids),
    // Ventas
    crearVenta: (venta) => electron_1.ipcRenderer.invoke("venta:crear", venta),
    obtenerVentas: () => electron_1.ipcRenderer.invoke("venta:obtenerTodas"),
    obtenerVentaPorId: (id) => electron_1.ipcRenderer.invoke("venta:obtenerPorId", id),
    eliminarVenta: (id) => electron_1.ipcRenderer.invoke("venta:eliminar", id),
    // DetalleVentas
    crearDetalleVenta: (detalle) => electron_1.ipcRenderer.invoke("detalleVenta:crear", detalle),
    obtenerDetallesPorVentaId: (ventaId) => electron_1.ipcRenderer.invoke("detalleVenta:obtenerPorVentaId", ventaId),
    eliminarDetalleVenta: (id) => electron_1.ipcRenderer.invoke("detalleVenta:eliminar", id),
    obtenerDetalles: () => electron_1.ipcRenderer.invoke("detalleVenta:obtenerTodos"),
    // Imágenes
    guardarImagenBuffer: (buffer, nombreArchivo) => electron_1.ipcRenderer.invoke("imagen:guardarBuffer", buffer, nombreArchivo),
    eliminarImagen: (ruta) => electron_1.ipcRenderer.invoke("imagen:eliminar", ruta),
});

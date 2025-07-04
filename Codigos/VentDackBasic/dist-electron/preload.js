"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    obtenerProductos: () => electron_1.ipcRenderer.invoke('producto:obtenerTodos'),
    obtenerProductoPorId: (id) => electron_1.ipcRenderer.invoke('producto:obtenerPorId', id),
    crearProducto: (producto) => electron_1.ipcRenderer.invoke('producto:crear', producto),
    editarProducto: (producto) => electron_1.ipcRenderer.invoke('producto:editar', producto),
    eliminarProducto: (id) => electron_1.ipcRenderer.invoke('producto:eliminar', id),
    eliminarProductos: (ids) => electron_1.ipcRenderer.invoke('producto:eliminarVarios', ids),
});

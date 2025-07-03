"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('api', {
    obtenerProductos: () => electron_1.ipcRenderer.invoke('producto:obtener'),
    insertarProducto: (nombre, precio) => electron_1.ipcRenderer.invoke('producto:insertar', nombre, precio),
});

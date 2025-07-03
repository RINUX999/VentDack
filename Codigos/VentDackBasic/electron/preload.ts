import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  obtenerProductos: () => ipcRenderer.invoke('producto:obtener'),
  insertarProducto: (nombre: string, precio: number) => ipcRenderer.invoke('producto:insertar', nombre, precio),
});

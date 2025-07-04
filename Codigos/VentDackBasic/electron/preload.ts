import { contextBridge, ipcRenderer } from 'electron';
import ProductoVenta from './db/models/ProductoVenta';

contextBridge.exposeInMainWorld('api', {
  obtenerProductos: () => ipcRenderer.invoke('producto:obtenerTodos'),
  obtenerProductoPorId: (id: string) => ipcRenderer.invoke('producto:obtenerPorId', id),
  crearProducto: (producto:ProductoVenta) => ipcRenderer.invoke('producto:crear', producto),
  editarProducto: (producto:ProductoVenta) => ipcRenderer.invoke('producto:editar', producto),
  eliminarProducto: (id: string) => ipcRenderer.invoke('producto:eliminar', id),
  eliminarProductos: (ids: string[]) => ipcRenderer.invoke('producto:eliminarVarios', ids),
  
  guardarImagen: (ruta: string) => ipcRenderer.invoke('imagen:guardar', ruta),
  eliminarImagen: (ruta: string) => ipcRenderer.invoke('imagen:eliminar', ruta),
  guardarImagenBuffer: (buffer: Uint8Array, nombreArchivo: string) =>
    ipcRenderer.invoke('imagen:guardarBuffer', buffer, nombreArchivo)
});


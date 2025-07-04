import { contextBridge, ipcRenderer } from 'electron';
import ProductoVenta from './db/models/ProductoVenta';

contextBridge.exposeInMainWorld('api', {
  obtenerProductos: () => ipcRenderer.invoke('producto:obtenerTodos'),
  obtenerProductoPorId: (id: string) => ipcRenderer.invoke('producto:obtenerPorId', id),
  crearProducto: (producto:ProductoVenta) => ipcRenderer.invoke('producto:crear', producto),
  editarProducto: (producto:ProductoVenta) => ipcRenderer.invoke('producto:editar', producto),
  eliminarProducto: (id: string) => ipcRenderer.invoke('producto:eliminar', id),
  eliminarProductos: (ids: string[]) => ipcRenderer.invoke('producto:eliminarVarios', ids),
});

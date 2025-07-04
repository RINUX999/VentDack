import { ipcMain } from 'electron';
import {
  crearProducto,
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  editarProducto,
  eliminarProducto,
  eliminarProductos,
} from '../../electron/db/services/ProductoVentaService'

export function registrarHandlers() {
  ipcMain.handle('producto:obtenerTodos', async () => {
    return await obtenerTodosLosProductos();
  });

  ipcMain.handle('producto:obtenerPorId', async (_event, id: string) => {
    return await obtenerProductoPorId(id);
  });

  ipcMain.handle('producto:crear', async (_event, producto) => {
    await crearProducto(producto);
  });

  ipcMain.handle('producto:editar', async (_event, producto) => {
    await editarProducto(producto);
  });

  ipcMain.handle('producto:eliminar', async (_event, id: string) => {
    await eliminarProducto(id);
  });

  ipcMain.handle('producto:eliminarVarios', async (_event, ids: string[]) => {
    await eliminarProductos(ids);
  });
}

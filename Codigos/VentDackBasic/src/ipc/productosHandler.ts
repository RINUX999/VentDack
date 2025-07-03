import { ipcMain } from 'electron';
import { insertarProducto, obtenerProductos } from '../../electron/db/productosRepo';

export function registrarProductosIPC() {
  ipcMain.handle('producto:obtener', async () => {
    return await obtenerProductos();
  });

  ipcMain.handle('producto:insertar', async (_event, nombre: string, precio: number) => {
    await insertarProducto(nombre, precio);
  });
}

import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import {
  crearProducto,
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  editarProducto,
  eliminarProducto,
  eliminarProductos
} from './db/services/ProductoVentaService';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  // Registrar protocolo personalizado para imágenes locales
  protocol.registerFileProtocol('app-img', (request, callback) => {
    try {
      // request.url es tipo "app-img://nombreArchivo.png"
      const urlPath = request.url.replace('app-img://', '');
      const carpetaImagenes = path.join(app.getPath('userData'), 'imagenes');
      const rutaImagen = path.join(carpetaImagenes, urlPath);
      callback({ path: rutaImagen });
    } catch (error) {
      console.error('Error en protocolo app-img:', error);
      callback({ error: -6 }); // FILE_NOT_FOUND
    }
  });

  // Handlers productos
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

  ipcMain.handle('imagen:guardarBuffer', async (_event, buffer: Uint8Array, nombreArchivo: string) => {
    try {
      const ext = path.extname(nombreArchivo) || '.png';
      const nombreUnico = `${Date.now()}-${uuidv4()}${ext}`;
      const carpetaDestino = path.join(app.getPath('userData'), 'imagenes');

      if (!fs.existsSync(carpetaDestino)) {
        fs.mkdirSync(carpetaDestino, { recursive: true });
      }

      const rutaFinal = path.join(carpetaDestino, nombreUnico);
      fs.writeFileSync(rutaFinal, Buffer.from(buffer));

      return rutaFinal;
    } catch (error) {
      console.error('Error al guardar imagen desde buffer:', error);
      return null;
    }
  });

  ipcMain.handle('imagen:eliminar', async (_event, ruta: string) => {
    try {
      if (fs.existsSync(ruta)) {
        fs.unlinkSync(ruta);
        return true;
      } else {
        console.warn("La imagen no existe:", ruta);
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      return false;
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

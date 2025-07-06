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

import {
  crearVenta,
  obtenerTodasLasVentas,
  obtenerVentaPorId,
  eliminarVenta
} from './db/services/VentaService';

import {
  crearDetalleVenta,
  obtenerDetallesPorVentaId,
  obtenerDetalles,
  eliminarDetalleVenta
} from './db/services/DetalleVentaService';

import {
  obtenerNegocio,
  guardarNegocio,
  editarNegocio,
  eliminarNegocio
} from './db/services/NegocioService';


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
  protocol.registerFileProtocol('app-img', (request, callback) => {
    try {
      const urlPath = request.url.replace('app-img://', '');
      const carpetaImagenes = path.join(app.getPath('userData'), 'imagenes');
      const rutaImagen = path.join(carpetaImagenes, urlPath);
      callback({ path: rutaImagen });
    } catch (error) {
      console.error('Error en protocolo app-img:', error);
      callback({ error: -6 });
    }
  });

  // Productos
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

  // Ventas
  ipcMain.handle('venta:crear', async (_event, venta) => {
    await crearVenta(venta);
  });

  ipcMain.handle('venta:obtenerTodas', async () => {
    return await obtenerTodasLasVentas();
  });

  ipcMain.handle('venta:obtenerPorId', async (_event, id: string) => {
    return await obtenerVentaPorId(id);
  });

  ipcMain.handle('venta:eliminar', async (_event, id: string) => {
    await eliminarVenta(id);
  });

  // Detalles de venta
  ipcMain.handle('detalleVenta:crear', async (_event, detalle) => {
    await crearDetalleVenta(detalle);
  });

  ipcMain.handle('detalleVenta:obtenerPorVentaId', async (_event, ventaId: string) => {
    return await obtenerDetallesPorVentaId(ventaId);
  });

  ipcMain.handle('detalleVenta:eliminar', async (_event, id: string) => {
    await eliminarDetalleVenta(id);
  });

  ipcMain.handle('detalleVenta:obtenerTodos', async () => {
    return await obtenerDetalles();
  });

  // Imágenes
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

  // Negocio
  ipcMain.handle('negocio:obtener', async () => {
    return await obtenerNegocio();
  });

  ipcMain.handle('negocio:guardar', async (_event, nombre: string) => {
    await guardarNegocio(nombre);
  });

  ipcMain.handle('negocio:editar', async (_event, id: string, nuevoNombre: string) => {
    await editarNegocio(id, nuevoNombre);
  });

  ipcMain.handle('negocio:eliminar', async (_event, id: string) => {
    await eliminarNegocio(id);
  });


  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

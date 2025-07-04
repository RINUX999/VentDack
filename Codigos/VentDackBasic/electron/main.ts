import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

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
  // IPC handlers
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

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
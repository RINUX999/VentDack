import { app, BrowserWindow, ipcMain, protocol, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import db from './db/db';

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

  // --- PRODUCTOS ---
  ipcMain.handle('producto:obtenerTodos', async () => await obtenerTodosLosProductos());
  ipcMain.handle('producto:obtenerPorId', async (_e, id) => await obtenerProductoPorId(id));
  ipcMain.handle('producto:crear', async (_e, p) => await crearProducto(p));
  ipcMain.handle('producto:editar', async (_e, p) => await editarProducto(p));
  ipcMain.handle('producto:eliminar', async (_e, id) => await eliminarProducto(id));
  ipcMain.handle('producto:eliminarVarios', async (_e, ids) => await eliminarProductos(ids));

  // --- VENTAS ---
  ipcMain.handle('venta:crear', async (_e, v) => await crearVenta(v));
  ipcMain.handle('venta:obtenerTodas', async () => await obtenerTodasLasVentas());
  ipcMain.handle('venta:obtenerPorId', async (_e, id) => await obtenerVentaPorId(id));
  ipcMain.handle('venta:eliminar', async (_e, id) => await eliminarVenta(id));

  // --- DETALLE DE VENTAS ---
  ipcMain.handle('detalleVenta:crear', async (_e, d) => await crearDetalleVenta(d));
  ipcMain.handle('detalleVenta:obtenerPorVentaId', async (_e, id) => await obtenerDetallesPorVentaId(id));
  ipcMain.handle('detalleVenta:obtenerTodos', async () => await obtenerDetalles());
  ipcMain.handle('detalleVenta:eliminar', async (_e, id) => await eliminarDetalleVenta(id));

  // --- IMÁGENES ---
  ipcMain.handle('imagen:guardarBuffer', async (_e, buffer, nombreArchivo) => {
    try {
      const ext = path.extname(nombreArchivo) || '.png';
      const nombreUnico = `${Date.now()}-${uuidv4()}${ext}`;
      const carpetaDestino = path.join(app.getPath('userData'), 'imagenes');
      if (!fs.existsSync(carpetaDestino)) fs.mkdirSync(carpetaDestino);
      const rutaFinal = path.join(carpetaDestino, nombreUnico);
      fs.writeFileSync(rutaFinal, Buffer.from(buffer));
      return rutaFinal;
    } catch (e) {
      console.error('Error guardar imagen:', e);
      return null;
    }
  });

  ipcMain.handle('imagen:eliminar', async (_e, ruta) => {
    try {
      if (fs.existsSync(ruta)) {
        fs.unlinkSync(ruta);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error eliminar imagen:', e);
      return false;
    }
  });

  // --- NEGOCIO ---
  ipcMain.handle('negocio:obtener', async () => await obtenerNegocio());
  ipcMain.handle('negocio:guardar', async (_e, nombre) => await guardarNegocio(nombre));
  ipcMain.handle('negocio:editar', async (_e, id, nuevoNombre) => await editarNegocio(id, nuevoNombre));
  ipcMain.handle('negocio:eliminar', async (_e, id) => await eliminarNegocio(id));

  // --- IMPORTAR SQL ---
  ipcMain.handle('importarSQL', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const { canceled, filePaths } = await dialog.showOpenDialog(win!, {
      filters: [{ name: 'SQL Files', extensions: ['sql'] }],
      properties: ['openFile']
    });
    if (canceled || filePaths.length === 0) return;

    let sql = fs.readFileSync(filePaths[0], 'utf8');

    // Reemplaza 'INSERT INTO' por 'INSERT OR IGNORE INTO' para evitar duplicados por PRIMARY KEY
    sql = sql.replace(/INSERT INTO/gi, 'INSERT OR IGNORE INTO');

    return new Promise<void>((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err.message);
        else resolve();
      });
    });
  });


  // --- EXPORTAR SQL ---
  ipcMain.handle('exportarSQL', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const { canceled, filePath } = await dialog.showSaveDialog(win!, {
      title: "Guardar como...",
      defaultPath: "backup.sql",
      filters: [{ name: "SQL Files", extensions: ["sql"] }],
    });
    if (canceled || !filePath) return;

    const tablas = ['producto_venta', 'venta', 'detalle_venta', 'negocio'];

    const exportarTabla = (tabla: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${tabla}`, (err, rows: any[]) => {
          if (err) return reject(err);
          const inserts = rows.map((fila) => {
            const valores = Object.values(fila).map((v) =>
              v === null ? 'NULL' :
                typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
            );
            return `INSERT INTO ${tabla} (${Object.keys(fila).join(", ")}) VALUES (${valores.join(", ")});`;
          });
          resolve(inserts.join('\n'));
        });
      });
    };

    const partes: string[] = [];
    for (const tabla of tablas) {
      try {
        const sql = await exportarTabla(tabla);
        partes.push(`-- Tabla: ${tabla}\n${sql}\n`);
      } catch (e) {
        console.error(`Error exportando tabla ${tabla}:`, e);
      }
    }

    const exportSQL = `
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
${partes.join('\n')}
COMMIT;
    `;

    fs.writeFileSync(filePath, exportSQL, 'utf8');
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

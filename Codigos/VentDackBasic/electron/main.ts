import { app, BrowserWindow, ipcMain, protocol, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import db from './db/db';

// Servicios
import {
  crearProducto, obtenerTodosLosProductos, obtenerProductoPorId,
  editarProducto, eliminarProducto, eliminarProductos
} from './db/services/ProductoVentaService';

import {
  crearVenta, obtenerTodasLasVentas, obtenerVentaPorId, eliminarVenta
} from './db/services/VentaService';

import {
  crearDetalleVenta, obtenerDetallesPorVentaId,
  obtenerDetalles, eliminarDetalleVenta
} from './db/services/DetalleVentaService';

import {
  obtenerNegocio, guardarNegocio,
  editarNegocio, eliminarNegocio
} from './db/services/NegocioService';

// ----------------------
// 🔐 Encriptación AES-256 CBC
const SECRET_PASSPHRASE = 'mi_clave_super_secreta_123456';
const SECRET_KEY = crypto.createHash('sha256').update(SECRET_PASSPHRASE).digest();
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
}

function decrypt(encrypted: string): string {
  const [ivBase64, data] = encrypted.split(':');
  const iv = Buffer.from(ivBase64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
  let decrypted = decipher.update(data, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// ----------------------
// 🎯 Códigos definidos
const codigosDefinidos = [
  { fecha: "2025-07-06", codigo: "CODE-202507-B9874C" },
  { fecha: "2025-08-06", codigo: "CODE-202508-C1234D" },
  { fecha: "2025-09-06", codigo: "CODE-202509-D5678E" },
];

// 📝 Generar y guardar archivo cifrado
function generarCodigosIniciales(userDataPath: string): string {
  const archivoCodigos = path.join(userDataPath, 'codigos-renta.json');
  const contenido = JSON.stringify(codigosDefinidos, null, 2);
  const cifrado = encrypt(contenido);
  fs.writeFileSync(archivoCodigos, cifrado, 'utf-8');
  console.log('✅ Archivo codigos-renta.json creado con códigos encriptados.');
  return archivoCodigos;
}

// 🧩 Verificar y crear si no existe
function asegurarArchivoCodigos(userDataPath: string): string {
  const archivoCodigos = path.join(userDataPath, 'codigos-renta.json');
  if (!fs.existsSync(archivoCodigos)) {
    return generarCodigosIniciales(userDataPath);
  }
  console.log('📂 Archivo codigos-renta.json ya existe.');
  return archivoCodigos;
}

// ----------------------
// 🪟 Crear ventana principal
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

// ----------------------
// 🚀 App ready
app.whenReady().then(() => {
  const userDataPath = app.getPath('userData');
  const archivoCodigos = asegurarArchivoCodigos(userDataPath);

  // 🔗 Protocolo para imágenes
  protocol.registerFileProtocol('app-img', (request, callback) => {
    try {
      const urlPath = request.url.replace('app-img://', '');
      const carpeta = path.join(userDataPath, 'imagenes');
      const rutaImagen = path.join(carpeta, urlPath);
      callback({ path: rutaImagen });
    } catch (error) {
      console.error('❌ Error en protocolo app-img:', error);
      callback({ error: -6 });
    }
  });

  // 🔓 IPC: Obtener códigos desencriptados
  ipcMain.handle('codigos:obtener', async () => {
    try {
      if (fs.existsSync(archivoCodigos)) {
        const cifrado = fs.readFileSync(archivoCodigos, 'utf-8');
        const descifrado = decrypt(cifrado);
        return JSON.parse(descifrado);
      }
      return null;
    } catch (error) {
      console.error('❌ Error leyendo/descifrando codigos-renta.json:', error);
      return null;
    }
  });

  // 📦 PRODUCTOS
  ipcMain.handle('producto:obtenerTodos', async () => await obtenerTodosLosProductos());
  ipcMain.handle('producto:obtenerPorId', async (_e, id) => await obtenerProductoPorId(id));
  ipcMain.handle('producto:crear', async (_e, p) => await crearProducto(p));
  ipcMain.handle('producto:editar', async (_e, p) => await editarProducto(p));
  ipcMain.handle('producto:eliminar', async (_e, id) => await eliminarProducto(id));
  ipcMain.handle('producto:eliminarVarios', async (_e, ids) => await eliminarProductos(ids));

  // 💳 VENTAS
  ipcMain.handle('venta:crear', async (_e, v) => await crearVenta(v));
  ipcMain.handle('venta:obtenerTodas', async () => await obtenerTodasLasVentas());
  ipcMain.handle('venta:obtenerPorId', async (_e, id) => await obtenerVentaPorId(id));
  ipcMain.handle('venta:eliminar', async (_e, id) => await eliminarVenta(id));

  // 🧾 DETALLE DE VENTAS
  ipcMain.handle('detalleVenta:crear', async (_e, d) => await crearDetalleVenta(d));
  ipcMain.handle('detalleVenta:obtenerPorVentaId', async (_e, id) => await obtenerDetallesPorVentaId(id));
  ipcMain.handle('detalleVenta:obtenerTodos', async () => await obtenerDetalles());
  ipcMain.handle('detalleVenta:eliminar', async (_e, id) => await eliminarDetalleVenta(id));

  // 🖼️ IMÁGENES
  ipcMain.handle('imagen:guardarBuffer', async (_e, buffer, nombreArchivo) => {
    try {
      const ext = path.extname(nombreArchivo) || '.png';
      const nombreUnico = `${Date.now()}-${uuidv4()}${ext}`;
      const carpetaDestino = path.join(userDataPath, 'imagenes');
      if (!fs.existsSync(carpetaDestino)) fs.mkdirSync(carpetaDestino);
      const rutaFinal = path.join(carpetaDestino, nombreUnico);
      fs.writeFileSync(rutaFinal, Buffer.from(buffer));
      return rutaFinal;
    } catch (e) {
      console.error('❌ Error guardando imagen:', e);
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
      console.error('❌ Error eliminando imagen:', e);
      return false;
    }
  });

  // 🏪 NEGOCIO
  ipcMain.handle('negocio:obtener', async () => await obtenerNegocio());
  ipcMain.handle('negocio:guardar', async (_e, nombre) => await guardarNegocio(nombre));
  ipcMain.handle('negocio:editar', async (_e, id, nuevoNombre) => await editarNegocio(id, nuevoNombre));
  ipcMain.handle('negocio:eliminar', async (_e, id) => await eliminarNegocio(id));

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

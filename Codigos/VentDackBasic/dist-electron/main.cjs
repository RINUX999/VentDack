"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
// Servicios
const ProductoVentaService_1 = require("./db/services/ProductoVentaService");
const VentaService_1 = require("./db/services/VentaService");
const DetalleVentaService_1 = require("./db/services/DetalleVentaService");
const NegocioService_1 = require("./db/services/NegocioService");
// ----------------------
// 🔐 Encriptación AES-256 CBC
const SECRET_PASSPHRASE = 'mi_clave_super_secreta_123456';
const SECRET_KEY = crypto_1.default.createHash('sha256').update(SECRET_PASSPHRASE).digest();
const IV_LENGTH = 16;
function encrypt(text) {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted;
}
function decrypt(encrypted) {
    const [ivBase64, data] = encrypted.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
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
function generarCodigosIniciales(userDataPath) {
    const archivoCodigos = path_1.default.join(userDataPath, 'codigos-renta.json');
    const contenido = JSON.stringify(codigosDefinidos, null, 2);
    const cifrado = encrypt(contenido);
    fs_1.default.writeFileSync(archivoCodigos, cifrado, 'utf-8');
    console.log('✅ Archivo codigos-renta.json creado con códigos encriptados.');
    return archivoCodigos;
}
// 🧩 Verificar y crear si no existe
function asegurarArchivoCodigos(userDataPath) {
    const archivoCodigos = path_1.default.join(userDataPath, 'codigos-renta.json');
    if (!fs_1.default.existsSync(archivoCodigos)) {
        return generarCodigosIniciales(userDataPath);
    }
    console.log('📂 Archivo codigos-renta.json ya existe.');
    return archivoCodigos;
}
// ----------------------
// 🪟 Crear ventana principal
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });
    const isDev = !electron_1.app.isPackaged;
    if (isDev) {
        win.loadURL('http://localhost:5173');
    }
    else {
        win.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
}
// ----------------------
// 🚀 App ready
electron_1.app.whenReady().then(() => {
    const userDataPath = electron_1.app.getPath('userData');
    const archivoCodigos = asegurarArchivoCodigos(userDataPath);
    // 🔗 Protocolo para imágenes
    electron_1.protocol.registerFileProtocol('app-img', (request, callback) => {
        try {
            const urlPath = request.url.replace('app-img://', '');
            const carpeta = path_1.default.join(userDataPath, 'imagenes');
            const rutaImagen = path_1.default.join(carpeta, urlPath);
            callback({ path: rutaImagen });
        }
        catch (error) {
            console.error('❌ Error en protocolo app-img:', error);
            callback({ error: -6 });
        }
    });
    // 🔓 IPC: Obtener códigos desencriptados
    electron_1.ipcMain.handle('codigos:obtener', async () => {
        try {
            if (fs_1.default.existsSync(archivoCodigos)) {
                const cifrado = fs_1.default.readFileSync(archivoCodigos, 'utf-8');
                const descifrado = decrypt(cifrado);
                return JSON.parse(descifrado);
            }
            return null;
        }
        catch (error) {
            console.error('❌ Error leyendo/descifrando codigos-renta.json:', error);
            return null;
        }
    });
    // 📦 PRODUCTOS
    electron_1.ipcMain.handle('producto:obtenerTodos', async () => await (0, ProductoVentaService_1.obtenerTodosLosProductos)());
    electron_1.ipcMain.handle('producto:obtenerPorId', async (_e, id) => await (0, ProductoVentaService_1.obtenerProductoPorId)(id));
    electron_1.ipcMain.handle('producto:crear', async (_e, p) => await (0, ProductoVentaService_1.crearProducto)(p));
    electron_1.ipcMain.handle('producto:editar', async (_e, p) => await (0, ProductoVentaService_1.editarProducto)(p));
    electron_1.ipcMain.handle('producto:eliminar', async (_e, id) => await (0, ProductoVentaService_1.eliminarProducto)(id));
    electron_1.ipcMain.handle('producto:eliminarVarios', async (_e, ids) => await (0, ProductoVentaService_1.eliminarProductos)(ids));
    // 💳 VENTAS
    electron_1.ipcMain.handle('venta:crear', async (_e, v) => await (0, VentaService_1.crearVenta)(v));
    electron_1.ipcMain.handle('venta:obtenerTodas', async () => await (0, VentaService_1.obtenerTodasLasVentas)());
    electron_1.ipcMain.handle('venta:obtenerPorId', async (_e, id) => await (0, VentaService_1.obtenerVentaPorId)(id));
    electron_1.ipcMain.handle('venta:eliminar', async (_e, id) => await (0, VentaService_1.eliminarVenta)(id));
    // 🧾 DETALLE DE VENTAS
    electron_1.ipcMain.handle('detalleVenta:crear', async (_e, d) => await (0, DetalleVentaService_1.crearDetalleVenta)(d));
    electron_1.ipcMain.handle('detalleVenta:obtenerPorVentaId', async (_e, id) => await (0, DetalleVentaService_1.obtenerDetallesPorVentaId)(id));
    electron_1.ipcMain.handle('detalleVenta:obtenerTodos', async () => await (0, DetalleVentaService_1.obtenerDetalles)());
    electron_1.ipcMain.handle('detalleVenta:eliminar', async (_e, id) => await (0, DetalleVentaService_1.eliminarDetalleVenta)(id));
    // 🖼️ IMÁGENES
    electron_1.ipcMain.handle('imagen:guardarBuffer', async (_e, buffer, nombreArchivo) => {
        try {
            const ext = path_1.default.extname(nombreArchivo) || '.png';
            const nombreUnico = `${Date.now()}-${(0, uuid_1.v4)()}${ext}`;
            const carpetaDestino = path_1.default.join(userDataPath, 'imagenes');
            if (!fs_1.default.existsSync(carpetaDestino))
                fs_1.default.mkdirSync(carpetaDestino);
            const rutaFinal = path_1.default.join(carpetaDestino, nombreUnico);
            fs_1.default.writeFileSync(rutaFinal, Buffer.from(buffer));
            return rutaFinal;
        }
        catch (e) {
            console.error('❌ Error guardando imagen:', e);
            return null;
        }
    });
    electron_1.ipcMain.handle('imagen:eliminar', async (_e, ruta) => {
        try {
            if (fs_1.default.existsSync(ruta)) {
                fs_1.default.unlinkSync(ruta);
                return true;
            }
            return false;
        }
        catch (e) {
            console.error('❌ Error eliminando imagen:', e);
            return false;
        }
    });
    // 🏪 NEGOCIO
    electron_1.ipcMain.handle('negocio:obtener', async () => await (0, NegocioService_1.obtenerNegocio)());
    electron_1.ipcMain.handle('negocio:guardar', async (_e, nombre) => await (0, NegocioService_1.guardarNegocio)(nombre));
    electron_1.ipcMain.handle('negocio:editar', async (_e, id, nuevoNombre) => await (0, NegocioService_1.editarNegocio)(id, nuevoNombre));
    electron_1.ipcMain.handle('negocio:eliminar', async (_e, id) => await (0, NegocioService_1.eliminarNegocio)(id));
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});

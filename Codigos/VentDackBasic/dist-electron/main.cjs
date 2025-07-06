"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("./db/db"));
const ProductoVentaService_1 = require("./db/services/ProductoVentaService");
const VentaService_1 = require("./db/services/VentaService");
const DetalleVentaService_1 = require("./db/services/DetalleVentaService");
const NegocioService_1 = require("./db/services/NegocioService");
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
electron_1.app.whenReady().then(() => {
    electron_1.protocol.registerFileProtocol('app-img', (request, callback) => {
        try {
            const urlPath = request.url.replace('app-img://', '');
            const carpetaImagenes = path_1.default.join(electron_1.app.getPath('userData'), 'imagenes');
            const rutaImagen = path_1.default.join(carpetaImagenes, urlPath);
            callback({ path: rutaImagen });
        }
        catch (error) {
            console.error('Error en protocolo app-img:', error);
            callback({ error: -6 });
        }
    });
    // --- PRODUCTOS ---
    electron_1.ipcMain.handle('producto:obtenerTodos', async () => await (0, ProductoVentaService_1.obtenerTodosLosProductos)());
    electron_1.ipcMain.handle('producto:obtenerPorId', async (_e, id) => await (0, ProductoVentaService_1.obtenerProductoPorId)(id));
    electron_1.ipcMain.handle('producto:crear', async (_e, p) => await (0, ProductoVentaService_1.crearProducto)(p));
    electron_1.ipcMain.handle('producto:editar', async (_e, p) => await (0, ProductoVentaService_1.editarProducto)(p));
    electron_1.ipcMain.handle('producto:eliminar', async (_e, id) => await (0, ProductoVentaService_1.eliminarProducto)(id));
    electron_1.ipcMain.handle('producto:eliminarVarios', async (_e, ids) => await (0, ProductoVentaService_1.eliminarProductos)(ids));
    // --- VENTAS ---
    electron_1.ipcMain.handle('venta:crear', async (_e, v) => await (0, VentaService_1.crearVenta)(v));
    electron_1.ipcMain.handle('venta:obtenerTodas', async () => await (0, VentaService_1.obtenerTodasLasVentas)());
    electron_1.ipcMain.handle('venta:obtenerPorId', async (_e, id) => await (0, VentaService_1.obtenerVentaPorId)(id));
    electron_1.ipcMain.handle('venta:eliminar', async (_e, id) => await (0, VentaService_1.eliminarVenta)(id));
    // --- DETALLE DE VENTAS ---
    electron_1.ipcMain.handle('detalleVenta:crear', async (_e, d) => await (0, DetalleVentaService_1.crearDetalleVenta)(d));
    electron_1.ipcMain.handle('detalleVenta:obtenerPorVentaId', async (_e, id) => await (0, DetalleVentaService_1.obtenerDetallesPorVentaId)(id));
    electron_1.ipcMain.handle('detalleVenta:obtenerTodos', async () => await (0, DetalleVentaService_1.obtenerDetalles)());
    electron_1.ipcMain.handle('detalleVenta:eliminar', async (_e, id) => await (0, DetalleVentaService_1.eliminarDetalleVenta)(id));
    // --- IMÁGENES ---
    electron_1.ipcMain.handle('imagen:guardarBuffer', async (_e, buffer, nombreArchivo) => {
        try {
            const ext = path_1.default.extname(nombreArchivo) || '.png';
            const nombreUnico = `${Date.now()}-${(0, uuid_1.v4)()}${ext}`;
            const carpetaDestino = path_1.default.join(electron_1.app.getPath('userData'), 'imagenes');
            if (!fs_1.default.existsSync(carpetaDestino))
                fs_1.default.mkdirSync(carpetaDestino);
            const rutaFinal = path_1.default.join(carpetaDestino, nombreUnico);
            fs_1.default.writeFileSync(rutaFinal, Buffer.from(buffer));
            return rutaFinal;
        }
        catch (e) {
            console.error('Error guardar imagen:', e);
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
            console.error('Error eliminar imagen:', e);
            return false;
        }
    });
    // --- NEGOCIO ---
    electron_1.ipcMain.handle('negocio:obtener', async () => await (0, NegocioService_1.obtenerNegocio)());
    electron_1.ipcMain.handle('negocio:guardar', async (_e, nombre) => await (0, NegocioService_1.guardarNegocio)(nombre));
    electron_1.ipcMain.handle('negocio:editar', async (_e, id, nuevoNombre) => await (0, NegocioService_1.editarNegocio)(id, nuevoNombre));
    electron_1.ipcMain.handle('negocio:eliminar', async (_e, id) => await (0, NegocioService_1.eliminarNegocio)(id));
    // --- IMPORTAR SQL ---
    electron_1.ipcMain.handle('importarSQL', async (event) => {
        const win = electron_1.BrowserWindow.fromWebContents(event.sender);
        const { canceled, filePaths } = await electron_1.dialog.showOpenDialog(win, {
            filters: [{ name: 'SQL Files', extensions: ['sql'] }],
            properties: ['openFile']
        });
        if (canceled || filePaths.length === 0)
            return;
        let sql = fs_1.default.readFileSync(filePaths[0], 'utf8');
        // Reemplaza 'INSERT INTO' por 'INSERT OR IGNORE INTO' para evitar duplicados por PRIMARY KEY
        sql = sql.replace(/INSERT INTO/gi, 'INSERT OR IGNORE INTO');
        return new Promise((resolve, reject) => {
            db_1.default.exec(sql, (err) => {
                if (err)
                    reject(err.message);
                else
                    resolve();
            });
        });
    });
    // --- EXPORTAR SQL ---
    electron_1.ipcMain.handle('exportarSQL', async (event) => {
        const win = electron_1.BrowserWindow.fromWebContents(event.sender);
        const { canceled, filePath } = await electron_1.dialog.showSaveDialog(win, {
            title: "Guardar como...",
            defaultPath: "backup.sql",
            filters: [{ name: "SQL Files", extensions: ["sql"] }],
        });
        if (canceled || !filePath)
            return;
        const tablas = ['producto_venta', 'venta', 'detalle_venta', 'negocio'];
        const exportarTabla = (tabla) => {
            return new Promise((resolve, reject) => {
                db_1.default.all(`SELECT * FROM ${tabla}`, (err, rows) => {
                    if (err)
                        return reject(err);
                    const inserts = rows.map((fila) => {
                        const valores = Object.values(fila).map((v) => v === null ? 'NULL' :
                            typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v);
                        return `INSERT INTO ${tabla} (${Object.keys(fila).join(", ")}) VALUES (${valores.join(", ")});`;
                    });
                    resolve(inserts.join('\n'));
                });
            });
        };
        const partes = [];
        for (const tabla of tablas) {
            try {
                const sql = await exportarTabla(tabla);
                partes.push(`-- Tabla: ${tabla}\n${sql}\n`);
            }
            catch (e) {
                console.error(`Error exportando tabla ${tabla}:`, e);
            }
        }
        const exportSQL = `
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
${partes.join('\n')}
COMMIT;
    `;
        fs_1.default.writeFileSync(filePath, exportSQL, 'utf8');
    });
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

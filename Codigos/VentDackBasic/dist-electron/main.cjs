"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const ProductoVentaService_1 = require("./db/services/ProductoVentaService");
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
    // Registrar protocolo personalizado para imágenes locales
    electron_1.protocol.registerFileProtocol('app-img', (request, callback) => {
        try {
            // request.url es tipo "app-img://nombreArchivo.png"
            const urlPath = request.url.replace('app-img://', '');
            const carpetaImagenes = path_1.default.join(electron_1.app.getPath('userData'), 'imagenes');
            const rutaImagen = path_1.default.join(carpetaImagenes, urlPath);
            callback({ path: rutaImagen });
        }
        catch (error) {
            console.error('Error en protocolo app-img:', error);
            callback({ error: -6 }); // FILE_NOT_FOUND
        }
    });
    // Handlers productos
    electron_1.ipcMain.handle('producto:obtenerTodos', async () => {
        return await (0, ProductoVentaService_1.obtenerTodosLosProductos)();
    });
    electron_1.ipcMain.handle('producto:obtenerPorId', async (_event, id) => {
        return await (0, ProductoVentaService_1.obtenerProductoPorId)(id);
    });
    electron_1.ipcMain.handle('producto:crear', async (_event, producto) => {
        await (0, ProductoVentaService_1.crearProducto)(producto);
    });
    electron_1.ipcMain.handle('producto:editar', async (_event, producto) => {
        await (0, ProductoVentaService_1.editarProducto)(producto);
    });
    electron_1.ipcMain.handle('producto:eliminar', async (_event, id) => {
        await (0, ProductoVentaService_1.eliminarProducto)(id);
    });
    electron_1.ipcMain.handle('producto:eliminarVarios', async (_event, ids) => {
        await (0, ProductoVentaService_1.eliminarProductos)(ids);
    });
    electron_1.ipcMain.handle('imagen:guardarBuffer', async (_event, buffer, nombreArchivo) => {
        try {
            const ext = path_1.default.extname(nombreArchivo) || '.png';
            const nombreUnico = `${Date.now()}-${(0, uuid_1.v4)()}${ext}`;
            const carpetaDestino = path_1.default.join(electron_1.app.getPath('userData'), 'imagenes');
            if (!fs_1.default.existsSync(carpetaDestino)) {
                fs_1.default.mkdirSync(carpetaDestino, { recursive: true });
            }
            const rutaFinal = path_1.default.join(carpetaDestino, nombreUnico);
            fs_1.default.writeFileSync(rutaFinal, Buffer.from(buffer));
            return rutaFinal;
        }
        catch (error) {
            console.error('Error al guardar imagen desde buffer:', error);
            return null;
        }
    });
    electron_1.ipcMain.handle('imagen:eliminar', async (_event, ruta) => {
        try {
            if (fs_1.default.existsSync(ruta)) {
                fs_1.default.unlinkSync(ruta);
                return true;
            }
            else {
                console.warn("La imagen no existe:", ruta);
                return false;
            }
        }
        catch (error) {
            console.error('Error al eliminar imagen:', error);
            return false;
        }
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

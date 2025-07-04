"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
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
    // IPC handlers
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

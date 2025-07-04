"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const fs_1 = __importDefault(require("fs"));
const electron_1 = require("electron");
const dbPath = path_1.default.join(electron_1.app.getPath('userData'), 'database.db');
const schemasDir = path_1.default.resolve(process.cwd(), 'electron/db/schemas');
const db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
        return;
    }
    // Leer todos los archivos .sql dentro de la carpeta schemas
    const files = fs_1.default.readdirSync(schemasDir).filter(f => f.endsWith('.sql'));
    for (const file of files) {
        const schema = fs_1.default.readFileSync(path_1.default.join(schemasDir, file), 'utf8');
        db.exec(schema, (err) => {
            if (err) {
                console.error(`Error al ejecutar ${file}:`, err.message);
            }
            else {
                console.log(`Esquema ejecutado correctamente: ${file}`);
            }
        });
    }
});
exports.default = db;

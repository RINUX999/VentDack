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
const schemaPath = path_1.default.resolve(process.cwd(), 'electron/db/schema.sql');
const schema = fs_1.default.readFileSync(schemaPath, 'utf8');
const db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err)
        return console.error('Error abrir DB:', err.message);
    db.exec(schema, (err) => {
        if (err)
            console.error('Error crear tablas:', err.message);
        else
            console.log('Tablas listas');
    });
});
exports.default = db;

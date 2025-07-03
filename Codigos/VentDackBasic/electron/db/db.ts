import path from 'path';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'database.db');
const schemaPath = path.resolve(process.cwd(), 'electron/db/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Error abrir DB:', err.message);
  db.exec(schema, (err) => {
    if (err) console.error('Error crear tablas:', err.message);
    else console.log('Tablas listas');
  });
});

export default db;

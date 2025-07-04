import path from 'path';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'database.db');
const schemasDir = path.resolve(process.cwd(), 'electron/db/schemas');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
    return;
  }

  // Leer todos los archivos .sql dentro de la carpeta schemas
  const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.sql'));

  for (const file of files) {
    const schema = fs.readFileSync(path.join(schemasDir, file), 'utf8');
    db.exec(schema, (err) => {
      if (err) {
        console.error(`Error al ejecutar ${file}:`, err.message);
      } else {
        console.log(`Esquema ejecutado correctamente: ${file}`);
      }
    });
  }
});

export default db;

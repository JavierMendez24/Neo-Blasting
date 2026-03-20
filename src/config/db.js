const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ubicación del archivo de base de datos en la raíz
const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear tabla con restricción de unicidad para evitar duplicados exactos
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS registros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            archivo TEXT,
            codigo TEXT,
            telefono TEXT,
            fecha_carga DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(codigo, telefono)
        )
    `);
});

module.exports = db;
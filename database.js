import sqlite3 from 'sqlite3';

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear una tabla de ejemplo (si no existe)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Clientes (
        ID_Cliente INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre VARCHAR(100) NOT NULL,
        Telefono VARCHAR(20),
        Direccion VARCHAR(200),
        Fecha_Registro DATE NOT NULL
    )`);
});


export default  db;

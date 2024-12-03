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
        Telefono VARCHAR(20) UNIQUE,
        Direccion VARCHAR(200),
        Fecha_Registro DATE NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Productos (
        ID_Producto INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre_Producto VARCHAR(100) NOT NULL,
        Categoria VARCHAR(50),
        Precio DECIMAL(10, 2) NOT NULL,
        Stock INT NOT NULL,
        Descripcion TEXT,
        ID_Proveedor INT,
        FOREIGN KEY (ID_Proveedor) REFERENCES Proveedor(ID_Proveedor)
        )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS Venta(
        ID_Venta INTEGER PRIMARY KEY AUTOINCREMENT,
        Fecha DATE NOT NULL,
        Total DECIMAL(10, 2) NOT NULL,
        Metodo_Pago VARCHAR(50),
        ID_Cliente INT,
        FOREIGN KEY (ID_Cliente) REFERENCES Clientes(ID_Clientes)
        )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS Proveedor (
        ID_Proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre_Proveedor VARCHAR(100) NOT NULL,
        Direccion VARCHAR(200),
        Telefono VARCHAR(20),
        Email VARCHAR(100)
        )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS Orden_Compra (
        ID_Orden INTEGER PRIMARY KEY AUTOINCREMENT,
        Fecha DATE NOT NULL,
        Total DECIMAL(10, 2) NOT NULL,
        ID_Proveedor INT,
        FOREIGN KEY (ID_Proveedor) REFERENCES Proveedor(ID_Proveedor)
        )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS Devolucion (
        ID_Devolucion INTEGER PRIMARY KEY AUTOINCREMENT,
        Fecha DATE NOT NULL,
        Cantidad_Devuelta INT NOT NULL,
        Motivo TEXT,
        ID_Cliente INT,
        ID_Producto INT,
        ID_Orden,
        FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente),
        FOREIGN KEY (ID_CLiente) REFERENCES Producto(ID_Producto),
        FOREIGN KEY (ID_Orden) REFERENCES Orden_Compra(ID_Orden)
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS Promocion (
        ID_Promocion INTEGER PRIMARY KEY AUTOINCREMENT,
        Descripcion TEXT,
        Fecha_Inicio DATE NOT NULL,
        Fecha_Fin DATE NOT NULL,
        Descuento DECIMAL(5, 2) NOT NULL
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS Venta_Producto (
        ID_Venta INT,
        ID_Producto INT,
        PRIMARY KEY (ID_Venta, ID_Producto),
        FOREIGN KEY (ID_Venta) REFERENCES Venta(ID_Venta),
        FOREIGN KEY (ID_Producto) REFERENCES Producto(ID_Producto)
        )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS Producto_Promocion (
        ID_Producto INT,
        ID_Promocion INT,
        PRIMARY KEY (ID_Producto, ID_Promocion),
        FOREIGN KEY (ID_Producto) REFERENCES Producto(ID_Producto),
        FOREIGN KEY (ID_Promocion) REFERENCES Promocion(ID_Promocion)
        )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS Orden_Producto (
        ID_Orden INT,
        ID_Producto INT,
        PRIMARY KEY (ID_Orden, ID_Producto),
        FOREIGN KEY (ID_Orden) REFERENCES Orden_Compra(ID_Orden),
        FOREIGN KEY (ID_Producto) REFERENCES Producto(ID_Producto) 
        )`);
});

export function agregarCliente(nombre, telefono, direccion, fechaRegistro, callback) {
    const sql = `INSERT INTO Clientes (Nombre, Telefono, Direccion, Fecha_Registro)
                 VALUES (?, ?, ?, ?)`;
    db.run(sql, [nombre, telefono, direccion, fechaRegistro], function(err) {
        if (err) {
            console.error('Error al agregar cliente:', err.message);
            callback(err, null);
        } else {
            console.log('Cliente agregado con ID:', this.lastID);
            callback(null, this.lastID); 
        }
    });
}

export function agregarProveedor(nombre, direccion, telefono, email, callback) {
    const sql = `INSERT INTO Clientes (Nombre_Proveedor, Direccion, Telefono, Email)
                 VALUES (?, ?, ?, ?)`;
    db.run(sql, [nombre, direccion, telefono, email], function(err) {
        if (err) {
            console.error('Error al agregar proveedor:', err.message);
            callback(err, null);
        } else {
            console.log('Proveedor agregado con ID:', this.lastID);
            callback(null, this.lastID); 
        }
    });
}

export function agregarProducto(nombre, categoria, precio, stock, descripcion, id_proveedor, callback) {
    const sql = `INSERT INTO Productos (Nombre_Producto, Categoria, Precio, Stock, Descripcion, ID_Proveedor)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [nombre, categoria, precio, stock, descripcion, id_proveedor], function(err) {
        if (err) {
            console.error('Error al agregar producto:', err.message);
            callback(err, null);
        } else {
            console.log('Producto agregado con ID:', this.lastID);
            callback(null, this.lastID);
        }
    });
}

export function agregarVenta(fecha, total, metodo_pago, id_cliente, callback) {
    const sql = `INSERT INTO Venta (Fecha, Total, Metodo_Pago, ID_Cliente)
                 VALUES (?, ?, ?, ?)`;
    db.run(sql, [fecha, total, metodo_pago, id_cliente], function(err) {
        if (err) {
            console.error('Error al agregar la venta:', err.message);
            callback(err, null);
        } else {
            console.log('Venta agregado con ID:', this.lastID);
            callback(null, this.lastID); 
        }
    });
}

export function agregarOrdenCompra(fecha, total, id_proveedor, callback) {
    const sql = `INSERT INTO Orden_Compra (Fecha, Total, ID_Proveedor)
                 VALUES (?, ?, ?)`;
    db.run(sql, [fecha, total, id_proveedor], function(err) {
        if (err) {
            console.error('Error al agregar la venta:', err.message);
            callback(err, null);
        } else {
            console.log('Venta agregado con ID:', this.lastID);
            callback(null, this.lastID); 
        }
    });
}


export function agregarDevolucion(fecha, cantidad_devuelta, motivo, id_cliente, id_producto, id_orden) {
    const sql = `INSERT INTO Devolucion (Fecha, Cantidad_Devuelta, Motivo, ID_Cliente, ID_Producto, ID_Orden)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [fecha, cantidad_devuelta, motivo, id_cliente, id_producto, id_orden ], function(err) {
        if (err) {
            console.error('Error al agregar la devolucion:', err.message);
            callback(err, null);
        } else {
            console.log('devolucion agregada con ID:', this.lastID);
            callback(null, this.lastID); 
        }
    });
}

export function agregarPromocion(descripcion, fecha_inicio, fecha_fin, descuento) {
    const sql = `INSERT INTO Promocion (Descripcion, Fecha_Inico, Fecha_Fin, Descuento)
                 VALUES (?, ?, ?, ?)`;
    db.run(sql, [descripcion, fecha_inicio, fecha_fin, descuento], function(err) {
        if (err) {
            console.error('Error al agregar la promocion:', err.message);
            callback(err, null);
        } else {
            console.log('Promocion agregado con ID:', this.lastID);
            callback(null, this.lastID); 
        }
    });
}


export function agregarVenta_Producto(id_venta, id_producto) {
    const sql = `INSERT INTO Promocion (ID_Venta, ID_Producto)
                 VALUES (?, ?)`;
    db.run(sql, [id_venta, id_producto], function(err) {
        if (err) {
            console.error('Error al agregar la promocion:', err.message);
            callback(err, null);
        } else {
            console.log('Promocion agregado con ID:', this.lastID);
            callback(null, this.lastID); 
        }
    });
}

export function agregarProducto_Promocion(id_producto, id_promocion) {
    const sql = `INSERT INTO Producto_Promocion (ID_Producto, ID_Promocion)
                 VALUES (?, ?)`;
    db.run(sql, [id_producto, id_promocion], function(err) {
        if (err) {
            console.error('Error al agregar la promocion:', err.message);
            callback(err, null);
        } else {
            console.log('Promocion agregado con ID:', this.lastID);
            callback(null, this.lastID); 
        }
    });
}

export function agregarOrden_Producto(id_orden, id_producto) {
    const sql = `INSERT INTO Orden (ID_Orden, ID_Producto)
                 VALUES (?, ?)`;
    db.run(sql, [id_orden, id_producto], function(err) {
        if (err) {
            console.error('Error al agregar la promocion:', err.message);
            callback(err, null);
        } else {
            console.log('Promocion agregado con ID:', this.lastID);
            callback(null, this.lastID); 
        }
    });
}



export default  db;

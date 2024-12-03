
import express from 'express';
import { engine } from 'express-handlebars';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import pkg from 'jsonwebtoken';
import db from './database.js';
import { agregarCliente, agregarProveedor, agregarProducto, agregarVenta, agregarOrdenCompra} from './database.js';
//BASE DE DATOS




dotenv.config();


export const CLAVE_SECRETA = process.env.CLAVE_SECRETA;
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME;
const { verify } = pkg;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configuración de Handlebars con el helper 'eq'
const hbs = engine({
  helpers: {
    eq: (a, b) => a === b, // Helper personalizado para comparar igualdad
  },
});

app.engine('handlebars', hbs); // Utiliza el motor configurado con los helpers
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/files', express.static('public'));

// Admin - Admin_Perfiles - Admin_Productos
app.get('/', (req, res) => {
  res.render('Admin');
});


/*
// AGREGAR LOS CLIENTES A LA BASE DE DATOS
 db.serialize(() => {
  const clientes = [
     { nombre: 'Natan Ramirez', telefono: '987654321', direccion: 'Ejército 441', fechaRegistro: '2024-12-02' },
     { nombre: 'Cristóbal Sepúlveda', telefono: '923456789', direccion: 'Vergara 424', fechaRegistro: '2024-10-02' },
     { nombre: 'Felipe Bustos', telefono: '956789123', direccion: 'Toesca 1', fechaRegistro: '2024-11-01' },
     { nombre: 'Jeffery Williams', telefono: '992178728', direccion: 'Santiago 21', fechaRegistro: '2024-11-23' },
     { nombre: 'Roberto Vazquez', telefono: '736152683', direccion: 'Estacion Central 3', fechaRegistro: '2024-11-16' },
     { nombre: 'Sara Maldonado', telefono: '244666366', direccion: 'La Florida 33', fechaRegistro: '2024-11-01' },
      { nombre: 'Francisca Gonzalez', telefono: '132323327', direccion: 'Quinta Normal 234', fechaRegistro: '2024-11-22' },
      { nombre: 'Sebastian Hurtado', telefono: '197137154', direccion: 'Maipú 667', fechaRegistro: '2024-11-02' },
      { nombre: 'Alexis Sanchez', telefono: '944421436', direccion: 'Puente Alto 34', fechaRegistro: '2024-11-30' },
      { nombre: 'Carmen Delgado', telefono: '417686632', direccion: 'Providencia 23', fechaRegistro: '2024-12-01' }

  ];

  clientes.forEach(cliente => {
     
    const sql = `INSERT OR IGNORE INTO Clientes (Nombre, Telefono, Direccion, Fecha_Registro) VALUES (?, ?, ?, ?)`;
    db.run(sql, [cliente.nombre, cliente.telefono, cliente.direccion, cliente.fechaRegistro], function(err) {
       if (err) {
           console.error(`Error al agregar cliente ${cliente.nombre}:`, err.message);
         } else if (this.changes > 0) {
           console.log(`Cliente ${cliente.nombre} agregado con ID: ${this.lastID}`);
        } else {
            console.log(`El cliente ${cliente.nombre} ya existe (mismo teléfono).`);
        }
    });
});
});

// AGREGAR UN PROVEEDOR A LA BASE DE DATOS
db.serialize(() => {
  const proveedor = [
    {nombre: 'sp5derworldwide', direccion: 'Atlanta', telefono: '877439257', email: 'sp5derworldwide@gmail.com'},
    {nombre: 'CHROME HEARTS', direccion: 'Los Angeles', telefono: '947641336', email: 'chromehearts@gmail.com'},
    {nombre: 'Corteiz', direccion: 'London', telefono: '622917225', email: 'corteiz@gmail.com'},
    {nombre: 'ZARA', direccion: 'La Coruña', telefono: '641995295', email: 'zara@gmail.com'},
    {nombre: 'New Era', direccion: 'New York', telefono: '493461564', email: 'newera@gmail.com'},
  ];

 proveedor.forEach(proveedor => {
    const sql = `INSERT OR IGNORE INTO Proveedor (Nombre_Proveedor, Direccion, Telefono, Email) VALUES (?, ?, ?, ?)`;
    db.run(sql, [proveedor.nombre, proveedor.direccion, proveedor.telefono, proveedor.email], function(err) {
        if (err) {
            console.error(`Error al agregar proveedor ${proveedor.telefono}:`, err.message);
         } else if (this.changes > 0) {
            console.log(`Proveedor ${proveedor.nombre} agregado con ID: ${this.lastID}`);
        } else {
            console.log(`El proveedor ${proveedor.nombre} ya existe (mismo teléfono).`);
        }
    });
});
  
});


// AGREGAR LOS PRODUCTOS DE LA BASE DE DATOS
db.serialize(() => {
const producto = [
  {nombre:'Hoodie sp5der', categoria: 'Hoodies', precio: '20000', stock: '20', descripcion: 'Hoodie de la ultima coleccion de la marca.', id_proveedor: '1'},
  {nombre:'Pantalón de buzo sp5der', categoria: 'Pantalones', precio: '15000', stock: '20', descripcion: 'Pantalaon de la ultima coleccion de la marca.', id_proveedor: '1'},
  {nombre:'Polera sp5der', categoria: 'Poleras', precio: '10000', stock: '30', descripcion: 'Polera de la ultima colecccion de la marca.', id_proveedor: '1'},
  {nombre:'Polera CHROME HEARTS', categoria: 'Poleras', precio: '15000', stock: '40', descripcion: 'Polera vintage de la marca.', id_proveedor: '2'},
  {nombre:'Lentes CHROME HEARTS', categoria: 'Accesorios', precio: '25000', stock: '10', descripcion: 'Lentes de edicion limitada.', id_proveedor: '2'},
  {nombre:'Beannie CHROME HEARTS', categoria: 'Gorros', precio: '12000', stock: '15', descripcion: 'Beannie de algodón', id_proveedor: '2'},
  {nombre:'Pantalón cargo Corteiz', categoria: 'Pantalones', precio: '25000', stock: '20', descripcion: 'Pantalon de estilo cargo de la ultima coleccion de Corteiz', id_proveedor: '3'},
  {nombre:'Polerón Corteiz', categoria: 'Chaquetas', precio: '35000', stock: '5', descripcion: 'Poleron Corteiz de la colaboracion con Central Cee', id_proveedor: '3'},
  {nombre:'Chaqueta Corteiz', categoria: 'Chaquetas', precio: '20000', stock: '10', descripcion: 'Chaqueta de la colaboración con Central Cee', id_proveedor: '3'},
  {nombre:'Mocasines Zara', categoria: 'Zapatos y zapatillas', precio: '45000', stock: '12', descripcion: 'Mocasines para cualquier ocasión', id_proveedor: '4'},
  {nombre:'Botas Zara', categoria: 'Zapatos y zapatillas', precio: '50000', stock: '12', descripcion: 'Botas de cuero de la ultima coleccion de la marca', id_proveedor: '4'},
  {nombre:'Zapatilas Zara', categoria: 'Zapatos y zapatillas', precio: '20000', stock: '20', descripcion: 'Zapatillas deportivas', id_proveedor: '4'},
  {nombre:'Gorra Atlanta Braves New Era', categoria: 'Gorros', precio: '20000', stock: '20', descripcion: 'Gorra de el equipo de beisbol de Atlanta', id_proveedor: '5'},
  {nombre:'Gorra Cincinatti Reds New Era', categoria: 'Gorros', precio: '20000', stock: '20', descripcion: 'Gorra del mejor equipo actual de la MLB', id_proveedor: '5'},
  {nombre:'Gorra Arizona DiamonBacks', categoria: 'Gorros', precio: '20000', stock: '20', descripcion: 'Gorra de el equipo de Arizona', id_proveedor: '5'},
];

producto.forEach(producto => {
  const sql = `INSERT OR IGNORE INTO Productos (Nombre_Producto, Categoria, Precio, Stock, Descripcion, ID_Proveedor) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [producto.nombre, producto.categoria, producto.precio, producto.stock, producto.descripcion, producto.id_proveedor], function(err) {   
          console.log(`Producto ${producto.nombre} agregado`);
  });
});
});

//agregar ventas
db.serialize(() => {
  const venta = [
    {fecha:'2024-12-02', total: '35000', metodo_pago: 'Débito', id_cliente: '1'},
    {fecha:'2024-10-21', total: '65000', metodo_pago: 'Efectivo', id_cliente: '2'},
    {fecha:'2024-11-10', total: '45000', metodo_pago: 'Efectivo', id_cliente: '3'},
    {fecha:'2024-11-23', total: '60000', metodo_pago: 'Débito', id_cliente: '4'},
    {fecha:'2024-11-25', total: '50000', metodo_pago: 'Débito', id_cliente: '5'},
    {fecha:'2024-11-02', total: '57000', metodo_pago: 'Crédito', id_cliente: '6'},
    {fecha:'2024-12-02', total: '55000', metodo_pago: 'Débito', id_cliente: '7'},
    {fecha:'2024-11-05', total: '70000', metodo_pago: 'Crédito', id_cliente: '8'},
    {fecha:'2024-11-30', total: '52000', metodo_pago: 'Débito', id_cliente: '9'},
    {fecha:'2024-12-02', total: '80000', metodo_pago: 'Débito', id_cliente: '10'},

  ]


venta.forEach(venta => {
  const sql = `INSERT OR IGNORE INTO Venta (Fecha, Total, Metodo_Pago, ID_Cliente) VALUES (?, ?, ?, ?)`;
  db.run(sql, [venta.fecha, venta.total, venta.metodo_pago, venta.id_cliente], function(err) {   
          console.log(`Venta ${venta.fecha} agregado`);
  });
});
});

//agregar ordenes de compra
db.serialize(() => {
  const orden_compra = [
    {fecha: '2024-10-01', total: '200000', id_proveedor: '1'},
    {fecha: '2024-09-30', total: '200000', id_proveedor: '2'},
    {fecha: '2024-11-01', total: '150000', id_proveedor: '3'},
    {fecha: '2024-11-01', total: '150000', id_proveedor: '4'},
    {fecha: '2024-12-01', total: '100000', id_proveedor: '5'},
  ]

orden_compra.forEach(orden_compra=> {
const sql = `INSERT OR IGNORE INTO Orden_Compra (Fecha, Total, ID_Proveedor) VALUES (?, ?, ?)`;
db.run(sql, [orden_compra.fecha, orden_compra.total, orden_compra.id_proveedor], function(err) {   
  console.log(` orden ${orden_compra.id} agregado`);
});
})
});

//agregar devoluciones
db.serialize(() => {
  const devolucion = [
    {fecha: '2024-12-01', cantidad_devuelta: '20000', motivo: 'Producto en mal estado', id_cliente: '3', id_producto: '13', id_orden: 'NULL'},
    {fecha: '2024-12-01', cantidad_devuelta: '15000', motivo: 'Producto erróneo', id_cliente: '3', id_producto: '3', id_orden: 'NULL'},
    {fecha: '2024-12-02', cantidad_devuelta: '200000', motivo: 'Productos erróneos', id_cliente: 'NULL', id_producto: 'NULL', id_orden: '2'},
    {fecha: '2024-11-30', cantidad_devuelta: '15000', motivo: 'Garantía', id_cliente: '6', id_producto: '4', id_orden: 'NULL'},
    {fecha: '2024-11-27', cantidad_devuelta: '35000', motivo: '--', id_cliente: '3', id_producto: '8', id_orden: 'NULL'},

  ]

devolucion.forEach(devolucion=> {
  const sql = `INSERT OR IGNORE INTO Devolucion (Fecha, Cantidad_Devuelta, Motivo, ID_Cliente, ID_Producto, ID_Orden) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [devolucion.fecha, devolucion.cantidad_devuelta, devolucion.motivo, devolucion.id_cliente, devolucion.id_producto, devolucion.id_orden], function(err) {   
    console.log(`Devolucion ${devolucion.fecha} agregado con ID: ${this.lastID}`);
  });
});  
});


  //agregar promociones
db.serialize(() => {
  const promocion = [
    {descripcion: 'Todos los accesorios o gorros con 30% de descuento', fecha_inicio: '2024-12-01', fecha_fin: '2025-01-01', descuento: '30'}
  ]
  promocion.forEach(promocion=> {
    const sql = `INSERT OR IGNORE INTO Promocion (Descripcion, Fecha_Inicio, Fecha_Fin, Descuento ) VALUES (?, ?, ?, ?)`;
    db.run(sql, [promocion.descripcion, promocion.fecha_inicio, promocion.fecha_fin, promocion.descuento], function(err) {   
      console.log(`Promocion ${promocion.descripcion} agregado con ID: ${this.lastID}`);
    });
  });  
  
})

//agregar venta producto
db.serialize(() => {
const venta_producto = [
  {id_venta: '1', id_producto: '1'},
  {id_venta: '1', id_producto: '2'},
  {id_venta: '2', id_producto: '1'},
  {id_venta: '2', id_producto: '2'},
  {id_venta: '2', id_producto: '3'},
  {id_venta: '2', id_producto: '13'},
  {id_venta: '3', id_producto: '3'},
  {id_venta: '3', id_producto: '8'},
  {id_venta: '4', id_producto: '11'},
  {id_venta: '4', id_producto: '3'},
  {id_venta: '5', id_producto: '11'},
  {id_venta: '6', id_producto: '2'},
  {id_venta: '6', id_producto: '6'},
  {id_venta: '6', id_producto: '15'},
  {id_venta: '6', id_producto: '3'},
  {id_venta: '7', id_producto: '2'},
  {id_venta: '7', id_producto: '2'},
  {id_venta: '7', id_producto: '3'},
  {id_venta: '7', id_producto: '4'},
  {id_venta: '8', id_producto: '10'},
  {id_venta: '8', id_producto: '5'},
  {id_venta: '9', id_producto: '6'},
  {id_venta: '9', id_producto: '12'},
  {id_venta: '8', id_producto: '14'},
  {id_venta: '10', id_producto:'11'},
  {id_venta: '10', id_producto: '13'},
  {id_venta: '10', id_producto: '3'}
 
]

venta_producto.forEach(venta_producto=> {
  const sql = `INSERT OR IGNORE INTO Venta_Producto (ID_Venta, ID_Producto ) VALUES (?, ?)`;
  db.run(sql, [venta_producto.id_venta, venta_producto.id_producto], function(err) {   
    console.log(`Agregado con ID: ${this.lastID}`);
  });
});  
})

//agrega producto promocion
db.serialize(() => {
const producto_promocion = [
{id_promocion: '1', id_producto: '5'},
{id_promocion: '1', id_producto: '6'},
{id_promocion: '1', id_producto: '13'},
{id_promocion: '1', id_producto: '14'},
{id_promocion: '1', id_producto: '15'},
]

producto_promocion.forEach(producto_promocion=> {
  const sql = `INSERT OR IGNORE INTO Producto_Promocion (ID_Producto, ID_Promocion) VALUES (?, ?)`;
  db.run(sql, [producto_promocion.id_producto, producto_promocion.id_promocion], function(err) {   
    console.log(`Agregado con ID: ${this.lastID}`);
  });
});
})


//agrega orden producto
db.serialize(() => {
const orden_producto = [
{id_orden: '1', id_producto: '1'},
{id_orden: '1', id_producto: '2'},
{id_orden: '1', id_producto: '3'},
{id_orden: '2', id_producto: '4'},
{id_orden: '2', id_producto: '5'},
{id_orden: '2', id_producto: '6'},
{id_orden: '3', id_producto: '7'},
{id_orden: '3', id_producto: '8'},
{id_orden: '3', id_producto: '9'},
{id_orden: '4', id_producto: '10'},
{id_orden: '4', id_producto: '11'},
{id_orden: '4', id_producto: '12'},
{id_orden: '5', id_producto: '13'},
{id_orden: '5', id_producto: '14'},
{id_orden: '5', id_producto: '15'}
]

orden_producto.forEach(orden_producto=> {
  const sql = `INSERT OR IGNORE INTO Orden_Producto (ID_Orden, ID_Producto) VALUES (?, ?)`;
  db.run(sql, [orden_producto.id_orden, orden_producto.id_producto], function(err) {   
    console.log(`Agregado ORDEN PRODUCTO con ID: ${this.lastID}`);
  });
});
})
*/



//muestra todos los clientes
app.get('/clientes', (req, res) => {
  db.all('SELECT * FROM Clientes', [], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
      } else {
          res.json({ Clientes: rows });
      }
  });
});

app.get('/venta', async (req, res) => {
  res.render('venta');
});

app.get('/orden', async (req, res) => {
  res.render('orden');
});


app.get('/Adminperfiles', (req, res) => {
  db.all('SELECT * FROM Clientes', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
      
      res.render('adminperfiles', { productos: rows });
  });
});


app.get('/Adminprod', (req, res) => {
  db.all('SELECT * FROM Productos', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
     
      res.render('adminprod', { productos: rows });
  });
});



app.get('/proveedor', (req, res) => {
  db.all('SELECT * FROM Proveedor', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
      
      res.render('proveedor', { productos: rows });
  });
});

app.get('/venta', (req, res) => {
  db.all('SELECT * FROM Venta', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
      
      res.render('venta', { productos: rows });
  });
});

app.get('/orden', (req, res) => {
  db.all('SELECT * FROM Orden_Compra', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
     
      res.render('orden', { productos: rows });
  });
});

app.get('/devolucion', (req, res) => {
  db.all('SELECT * FROM devolucion', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
     
      res.render('devolucion', { productos: rows });
  });
});

app.get('/promocion', (req, res) => {
  db.all('SELECT * FROM promocion', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
     
      res.render('promocion', { productos: rows });
  });
});

app.get('/ventaProducto', (req, res) => {
  db.all('SELECT * FROM Venta_Producto', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
     
      res.render('ventaProducto', { productos: rows });
  });
});

app.get('/productoPromocion', (req, res) => {
  db.all('SELECT * FROM Producto_Promocion', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
     
      res.render('productoPromocion', { productos: rows });
  });
});
app.get('/ordenProducto', (req, res) => {
  db.all('SELECT * FROM Orden_Producto', [], (err, rows) => {
      if (err) {
          return res.status(500).send('Error al obtener los clientes');
      }
     
      res.render('ordenProducto', { productos: rows });
  });
});


// formulario_editar - formulario_agregar
app.get('/formularioedit', async (req, res) => { 
  const id = req.query.ID_Producto;

  if (!id || isNaN(id)) {
    return res.status(400).send('ID de producto inválido o no proporcionado');
  }

  try {
    const query = 'SELECT ID_Producto, Nombre_Producto, Categoria, Precio, Stock, Descripcion, ID_Proveedor FROM Productos WHERE ID_Producto = ?';
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        return res.status(500).send('Error interno del servidor');
      }
      if (!row) {
        return res.status(404).send('Producto no encontrado');
      }
      res.render('formularioedit', { producto: row });
    });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send('Error al cargar el producto');
  }
});



app.get('/formulariopro', async (req, res) => {
  res.render('formulariopro');
});

app.get('/formulariocliente', async (req, res) => {
  res.render('formulariocliente');
});

app.get('/consultas', async (req, res) => {
  res.render('consultas');
});

// Eliminar Producto
app.get('/eliminarpro', (req, res) => {
  const id = req.query.ID_Producto; // Asegúrate de usar el nombre correcto del parámetro de la URL

  if (!id) {
    return res.status(400).send('ID de producto no proporcionado');
  }

  res.render('eliminarpro', { producto_id: id }); // Pasa el ID del producto a la vista para confirmación
});



app.post('/formulariopro', (req, res) => {
  const { nombre, stock, precio, categoria, descripcion, id_proveedor } = req.body;

  if (!nombre || !stock || !precio || !categoria || !descripcion || !id_proveedor) {
      return res.status(400).send('Todos los campos son obligatorios.');
  }

  const sql = "INSERT INTO Productos (Nombre_Producto, Stock, Precio, Categoria, Descripcion, ID_Proveedor) VALUES (?, ?, ?, ?, ?, ?)";

  db.run(sql, [nombre, stock, precio, categoria, descripcion, id_proveedor], function (err) {
      if (err) {
          console.error(err.message);
          return res.status(500).send('Error al agregar el producto.');
      }
      res.redirect('/Adminprod'); // Redirige a la página de administración de productos
  });
});



app.post('/formularioedit/producto/:ID_Producto', (req, res) => {
  const productId = req.params.ID_Producto;
  const { Nombre_Producto, Categoria, Precio, Stock, Descripcion, ID_Proveedor } = req.body;

  if (!Nombre_Producto || !Categoria || !Precio || !Stock || !Descripcion || !ID_Proveedor) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  const query = `
    UPDATE Productos
    SET Nombre_Producto = ?, Categoria = ?, Precio = ?, Stock = ?, Descripcion = ?, ID_Proveedor = ?
    WHERE ID_Producto = ?
  `;

  db.run(
    query,
    [Nombre_Producto, Categoria, Precio, Stock, Descripcion, ID_Proveedor, productId],
    function (err) {
      if (err) {
        console.error("Error al actualizar el producto:", err);
        return res.status(500).send('Error al actualizar el producto.');
      }

      console.log(`Producto con ID ${productId} actualizado correctamente.`);
      res.redirect('/Adminprod');
    }
  );
});


app.post('/eliminarpro', (req, res) => {
  const productoId = req.body.producto_id; // ID proporcionado desde el formulario

  if (!productoId) {
    return res.status(400).send('ID de producto no proporcionado');
  }

  const query = 'DELETE FROM Productos WHERE ID_Producto = ?'; // Asegúrate de que el nombre de la tabla y columna coincidan

  db.run(query, [productoId], function (err) {
    if (err) {
      console.error("Error al eliminar el producto:", err);
      return res.status(500).send('Error al eliminar el producto');
    }

    console.log(`Producto con ID ${productoId} eliminado correctamente.`);
    res.redirect('/Adminprod'); // Redirige a la lista de productos
  });
});


app.post('/Adminprod', async (req, res) => {
  const productoId = req.body.id; // Obtener el ID del producto desde el formulario
  try {
    const query = 'DELETE FROM productos WHERE id = $1';
    await sql(query, [productoId]); // Eliminar el producto de la base de datos
    res.redirect('/Adminprod'); // Redirigir a la lista de productos
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el producto');
  }
});

// Ruta para manejar las consultas
app.post('/consultas', (req, res) => {
  const consultaSeleccionada = req.body.consulta;

  // Mapear opciones a consultas SQL
  const consultas = {
    consulta1: `
      SELECT p.Nombre_Producto, SUM(vp.Cantidad) AS Total_Vendido
      FROM Venta_Producto vp
      JOIN Productos p ON vp.ID_Producto = p.ID_Producto
      JOIN Venta v ON vp.ID_Venta = v.ID_Venta
      WHERE v.Fecha >= DATE('now', '-1 month')
      GROUP BY p.Nombre_Producto
      ORDER BY Total_Vendido DESC;
    `,
    consulta2: `
      SELECT c.Nombre, v.ID_Venta, v.Total
      FROM Venta v
      JOIN Clientes c ON v.ID_Cliente = c.ID_Cliente
      WHERE v.Total > 35.00;
    `,
    consulta3: `
      SELECT p.Nombre_Proveedor, AVG(JULIANDAY(oc.Fecha_Entrega) - JULIANDAY(oc.Fecha)) AS Promedio_Dias_Entrega
      FROM Orden_Compra oc
      JOIN Proveedor p ON oc.ID_Proveedor = p.ID_Proveedor
      WHERE oc.Fecha_Entrega IS NOT NULL
      GROUP BY p.Nombre_Proveedor;
    `,
    consulta4: `
      SELECT oc.ID_Orden, p.Nombre_Proveedor, oc.Fecha, oc.Total
      FROM Orden_Compra oc
      JOIN Proveedor p ON oc.ID_Proveedor = p.ID_Proveedor
      WHERE oc.Estado = 'Pendiente';
    `,
    consulta5: `
      SELECT Metodo_Pago, COUNT(*) AS Cantidad_Usos
      FROM Venta
      GROUP BY Metodo_Pago
      ORDER BY Cantidad_Usos DESC;
    `,
    consulta6: `
      SELECT p.Nombre_Proveedor, COUNT(oc.ID_Orden) AS Entregas_Tardias
      FROM Orden_Compra oc
      JOIN Proveedor p ON oc.ID_Proveedor = p.ID_Proveedor
      WHERE oc.Fecha_Entrega > oc.Fecha
        AND oc.Fecha >= DATE('now', '-1 year')
      GROUP BY p.Nombre_Proveedor;
    `,
    consulta7: `
      SELECT v.ID_Venta, v.Fecha, v.Total, vp.ID_Producto, p.Nombre_Producto, vp.Cantidad
      FROM Venta v
      JOIN Venta_Producto vp ON v.ID_Venta = vp.ID_Venta
      JOIN Productos p ON vp.ID_Producto = p.ID_Producto
      WHERE v.ID_Cliente = 2
      ORDER BY v.Fecha DESC;
    `,
    consulta8: `
      SELECT pr.Descripcion, COUNT(vp.ID_Producto) AS Productos_Vendidos
      FROM Producto_Promocion pp
      JOIN Promocion pr ON pp.ID_Promocion = pr.ID_Promocion
      JOIN Venta_Producto vp ON pp.ID_Producto = vp.ID_Producto
      JOIN Venta v ON vp.ID_Venta = v.ID_Venta
      WHERE pr.Fecha_Inicio >= DATE('now', '-3 months')
        AND v.Fecha >= pr.Fecha_Inicio
        AND v.Fecha <= pr.Fecha_Fin
      GROUP BY pr.Descripcion
      ORDER BY Productos_Vendidos DESC;
    `,
    consulta9: `
      SELECT p.Nombre_Proveedor, AVG(JULIANDAY(oc.Fecha_Entrega) - JULIANDAY(oc.Fecha)) AS Promedio_Dias_Entrega
      FROM Orden_Compra oc
      JOIN Proveedor p ON oc.ID_Proveedor = p.ID_Proveedor
      WHERE oc.Fecha_Entrega IS NOT NULL
      GROUP BY p.Nombre_Proveedor;
    `,
    consulta10: `
      SELECT p.Nombre_Proveedor, AVG(JULIANDAY(oc.Fecha_Entrega) - JULIANDAY(oc.Fecha)) AS Promedio_Dias_Entrega
      FROM Orden_Compra oc
      JOIN Proveedor p ON oc.ID_Proveedor = p.ID_Proveedor
      WHERE oc.Fecha_Entrega IS NOT NULL
      GROUP BY p.Nombre_Proveedor;
    `,
  };

  const query = consultas[consultaSeleccionada];

  if (!query) {
    return res.status(400).send('Consulta no válida.');
  }

  // Ejecutar la consulta en SQLite
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Renderizar la vista con los resultados
    res.render('consultas', { resultados: rows });
  });
});


app.listen(3001, () => console.log('Servidor encendido en el puerto 3000'));
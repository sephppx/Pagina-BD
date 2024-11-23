import { neon } from '@neondatabase/serverless';
import express from 'express';
import { engine } from 'express-handlebars';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import pkg from 'jsonwebtoken';

dotenv.config();

const sql = neon(process.env.DATABASE_URL)
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
  res.render('Admin', { isAdmin: true, userName: req.user.name });
});

app.get('/Adminprod', async (req, res) => {
  try {
    const query = 'SELECT * FROM productos ORDER BY id ASC';
    const results = await sql(query);

    res.render('Adminprod', { productos: results });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render('Adminprod', { error: "No se pudieron cargar los productos." });
  }
});


app.get('/Adminperfiles', (req, res) => {
  res.render('Adminperfiles');
});

// formulario_editar - formulario_agregar
app.get('/formularioedit', async (req, res) => {
  const id = req.query.id; // Obtener el ID del producto de la URL

  try {
    // Consultar el producto por ID
    const query = 'SELECT id, nombre, stock, precio, imagen_url FROM productos WHERE id = $1';
    const result = await sql(query, [id]);

    if (result.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    const producto = result[0]; // Obtener el primer resultado (el producto)
    
    // Renderizar la vista de edición con los datos del producto
    res.render('formularioedit', { producto });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send('Error al cargar el producto');
  }
});

app.get('/formulariopro', async (req, res) => {
  res.render('formulariopro');
});

// Eliminar Producto
app.get('/eliminarpro', async (req, res) => {
  const id = req.query.id; // Obtener el ID del producto de la URL
  if (!id) {
      return res.status(400).send('ID de producto no proporcionado');
  }
  res.render('eliminarpro', { producto_id: id }); // Pasar el id a la vista
});


app.post('/formulariopro', async (req, res) => {
  const nombre = req.body.nombre;
  const stock = req.body.stock;
  const precio = req.body.precio;
  const imagen_url = req.body.imagen_url;

  // Validaciones simples
  if (!nombre || stock < 0 || precio < 0 || !imagen_url) {
    return res.render('formulariopro', { error: "Por favor, completa todos los campos correctamente." });
  }

  const query = 'INSERT INTO productos (nombre, stock, precio, imagen_url) VALUES ($1, $2, $3, $4) RETURNING id';

  try {
    const results = await sql(query, [nombre, stock, precio, imagen_url]);
    const id = results[0].id;
    
    // Redirige a la lista de productos o a una página de éxito
    res.redirect(302, '/Adminprod'); 
  } catch (error) {
    console.error(error);
    return res.render('formulariopro', { error: "Hubo un problema al registrar el producto. Intenta nuevamente." });
  }
});

app.post('/formularioedit/producto/:id', async(req, res) => {
  const productId = req.params.id
  const {nombre, stock, precio, imagen_url} = req.body

  try {
    await sql('UPDATE productos SET nombre = $1, stock=$2, precio=$3, imagen_url=$4 WHERE id=$5;', [nombre, stock, precio, imagen_url, productId])
    return res.redirect('/Adminprod')

  } catch(error){
    console.log(error)
    return res.send('HUBO UN ERROR')
  }

})

app.post('/eliminarpro', async (req, res) => {
  const productoId = req.body.producto_id; // Obtener el ID del producto desde el formulario
  if (!productoId) {
      return res.status(400).send('ID de producto no proporcionado');
  }

  try {
      const query = 'DELETE FROM productos WHERE id = $1';
      await sql(query, [productoId]); // Eliminar el producto de la base de datos
      res.redirect('/Adminprod'); // Redirigir a la lista de productos
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el producto');
  }
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

app.listen(3001, () => console.log('Servidor encendido en el puerto 3000'));
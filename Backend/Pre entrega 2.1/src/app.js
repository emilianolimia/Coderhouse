const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

// Importar models
const messageModel = require('./models/message')
const productModel = require('./models/product');
const cartModel = require('./models/cart');

// Importar los routers de productos y carritos
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');
const sessionsRouter = require('./routes/sessionRouter');

const app = express();
const port = 8080;

// Middleware para parsear el cuerpo de la solicitud en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión con MongoDB
mongoose.connect('mongodb+srv://emilimiadev:<password>@cluster0.mlbri5k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("DB is connected"))
    .catch(e => console.log(e))

app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: true,
}));

// Usar los routers de productos y carritos en la aplicación
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);

// Middleware para redirigir al endpoint /login
app.use((req, res, next) => {
  console.log('Middleware de redirección:', req.originalUrl);

  if (!req.session.user && req.originalUrl !== '/api/sessions/login' && req.method !== 'POST') {
    return res.redirect('/api/sessions/login');
  }
  next();
});

// Inicialización del servidor
const server = http.createServer(app);
const io = socketio(server);

server.listen(port, () => {
  console.log(`Servidor corriendo en ${port}`);
});

// Manejo de conexión de sockets
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('message', async data => {
    const newMessage = await messageModel.create(data);
    res.status(201).send(newMessage);

    const messages = await messageModel.find();
    io.emit('messageLogs', messages)
  })

  // Manejo de eventos de creación de producto
  socket.on('productCreated', () => {
    io.emit('productListUpdated');
  });

  // Manejo de eventos de eliminación de producto
  socket.on('productDeleted', () => {
    io.emit('productListUpdated');
  });
});

app.get('/products', async (req, res) => {
  try {
      const products = await productModel.find();
      console.log(products);
      res.render('home', { 
        products: JSON.parse(JSON.stringify(products)),
        user: req.session.user // Pasa el usuario al contexto de la vista
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/products/:pid', async (req, res) => {
  try {
      const productId = req.params.pid;
      const product = await productModel.findById(productId).lean();

  
      if (product) {
        res.render('productDetails', { product });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/carts/:cid', async (req, res) => {
  try {
      const cartId = req.params.cid;
  
      // Obtener el carrito por ID con los productos completos mediante "populate"
      const cart = await cartModel.findById(cartId).populate('products.id_prod');
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
      console.log(cart);
      res.render('cart', { cart: JSON.parse(JSON.stringify(cart)) });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/profile', (req, res) => {
  if (req.session.user) {
    // Si el usuario está autenticado, muestra el perfil
    res.render('profile', { user: req.session.user });
  } else {
    // Si el usuario no está autenticado, redirige al login
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.render('login'); // Renderiza la vista de login
});

app.get('/register', (req, res) => {
  res.render('register'); // Renderiza la vista de register
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.redirect('/login');  // Redirige al usuario a la vista de login después de cerrar sesión
  });
});
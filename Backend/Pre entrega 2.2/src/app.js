const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./passportConfig');

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
mongoose.connect('mongodb+srv://emilimiadev:qKcR4pvMYlS89gTD@cluster0.mlbri5k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("DB is connected"))
    .catch(e => console.log(e))

// Configuración de la sesión
app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Cambia a 'true' si estás en producción y usando HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // Tiempo de vida de la cookie en milisegundos
  }
}));

// Requiere e inicializa Passport
app.use(passport.initialize());
app.use(passport.session());

// Usar los routers de productos y carritos en la aplicación
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);

// Middleware para redirigir al endpoint /login
app.use((req, res, next) => {
  console.log('Middleware de redirección:', req.originalUrl);
  console.log('Usuario en sesión:', req.session.user);
  console.log('ID de sesión:', req.session.id);

  // Si la ruta es /api/sessions/login, /products, /favicon.ico o /api/sessions/login/github/callback, continúa con la siguiente middleware
  if (req.originalUrl === '/api/sessions/login' || req.originalUrl === '/products' || req.originalUrl === '/favicon.ico' || req.originalUrl === '/api/sessions/login/github/callback') {
    console.log('Pasando por el primer if');
    return next();
  }

  // Si no hay un usuario en sesión y la ruta no es /api/sessions/login, redirige al endpoint /api/sessions/login
  if (!req.session.user && req.originalUrl !== '/api/sessions/login') {
    console.log('Pasando por el segundo if');
    return res.redirect('/api/sessions/login');
  }

  // Si el usuario está en sesión y la ruta es diferente a /products, redirige a /products
  if (req.session.user && req.originalUrl !== '/products') {
    console.log('Pasando por el tercer if');
    return res.redirect('/products');
  }

  console.log('Pasando por el último caso (next)');
  next();
});

// Middleware para comprobar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  // Passport añade el método isAuthenticated a req
  if (req.isAuthenticated()) {
    return next();
  }
  // Si el usuario no está autenticado, redirige al login
  res.redirect('/login');
};

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

app.get('/products', isAuthenticated, async (req, res) => {
  try {
    const products = await productModel.find();

    // Utiliza req.user en lugar de req.session.user para acceder al usuario autenticado
    const user = req.user ? req.user : null;
    console.log(user);
    
    res.render('home', { 
      products: JSON.parse(JSON.stringify(products)),
      user: user // Pasa el usuario al contexto de la vista
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
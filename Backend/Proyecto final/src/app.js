require('dotenv').config();
const config = require('../config');
const express = require('express');
const { create } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./passportConfig');
const errorHandler = require('./middlewares/errorHandler');

// Importar models
const messageModel = require('./models/message')
const productModel = require('./models/product');
const cartModel = require('./models/cart');
const ticketModel = require('./models/ticketModel');

// Importar los routers de productos y carritos
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');
const sessionsRouter = require('./routes/sessionRouter');
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');

// Importar las rutas de pruebas de logs
const loggerTestRoutes = require('./loggerTest');

const app = express();
const port = 8080;

// Middleware para parsear el cuerpo de la solicitud en formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Handlebars con acceso inseguro a propiedades del prototipo
const hbs = create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  extname: '.handlebars',
  defaultLayout: 'main',
  helpers: {
    ifCond: function(v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión con MongoDB
mongoose.connect(config.dbUrl)
    .then(() => console.log("DB is connected"))
    .catch(e => console.log(e))

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'sessionSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Cambiar a 'true' si se usa en producción y usando HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // Tiempo de vida de la cookie en milisegundos
  }
}));

// Requiere e inicializa Passport
app.use(passport.initialize());
app.use(passport.session());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Usar los routers de productos y carritos en la aplicación
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Usar las rutas de pruebas de logs
app.use(loggerTestRoutes);

// Middleware para redirigir al endpoint /login
app.use((req, res, next) => {
  console.log('Middleware de redirección:', req.originalUrl);
  console.log('Usuario en sesión:', req.user);
  console.log('ID de sesión:', req.sessionID);

  const publicPaths = [
    '/api/sessions/login',
    '/products',
    '/favicon.ico',
    '/api/sessions/login/github/callback',
    '/login',
    '/register'
  ];
  
  if (publicPaths.includes(req.originalUrl)) {
    console.log('Pasando por el primer if');
    return next();
  }

  if (!req.isAuthenticated()) {
    console.log('Pasando por el segundo if');
    return res.redirect('login');
  }

  console.log('Pasando por el último caso (next)');
  next();
});

// Middleware para comprobar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  console.log('Revisando autenticación');
  // Passport añade el método isAuthenticated a req
  if (req.isAuthenticated()) {
    console.log('Usuario autenticado');
    return next();
  }
  // Si el usuario no está autenticado, redirige al login
  console.log('Usuario no autenticado');
  res.redirect('/login');
};

// Middleware de manejo de errores
app.use(errorHandler);

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
    const cartId = req.session.user.cart; // Obtener el cartId del usuario de la sesión

    // Utiliza req.user en lugar de req.session.user para acceder al usuario autenticado
    const user = req.user ? req.user : null;
    console.log(user);
    
    res.render('home', { 
      products: JSON.parse(JSON.stringify(products)),
      user: user, // Pasa el usuario al contexto de la vista
      cartId: cartId
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
      const productId = req.params.pid;
      const product = await productModel.findById(productId).lean();
      const cartId = req.session.cartId; // Obtener el cartId de la sesión
  
      if (product) {
        res.render('productDetails', { product, cartId });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/cart', async (req, res) => {
  try {
    const cartId = req.user.cart;
    console.log('ID del carrito en la sesión:', cartId);

    if (!cartId) {
      return res.status(404).json({ error: 'Carrito no encontrado para el usuario' });
    }

    // Obtener el carrito por ID con los productos completos mediante "populate"
    const cart = await cartModel.findById(cartId).populate('products.id_prod');
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    console.log('Carrito encontrado:', cart);

    res.render('cart', { cart: JSON.parse(JSON.stringify(cart)) });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/profile', (req, res) => {
  if (req.user) {
    // Si el usuario está autenticado, muestra el perfil
    res.render('profile', { user: req.user });
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

// Ruta para mostrar la página de confirmación de compra
app.get('/checkout', async (req, res) => {
  try {
      const cartId = req.session.user.cart;
      const cart = await cartModel.findById(cartId).populate('products.id_prod').lean();
      if (!cart) {
          return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      const total = cart.products.reduce((sum, product) => {
          return sum + product.id_prod.price * product.quantity;
      }, 0);

      res.render('checkout', { cart, total });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para mostrar el resumen de la compra
app.get('/order/:ticketId', async (req, res) => {
  try {
      const ticketId = req.params.ticketId;
      const ticket = await ticketModel.findById(ticketId).lean();
      if (!ticket) {
          return res.status(404).json({ error: 'Ticket no encontrado' });
      }
      res.render('order', { ticket });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});
const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');

// Importar models
const messageModel = require('./models/message')
const productModel = require('./models/product');
const cartModel = require('./models/cart');

// Importar los routers de productos y carritos
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');

const app = express();
const port = 8080;

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

// Usar los routers de productos y carritos en la aplicación
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

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

app.use(express.json());

app.get('/products', async (req, res) => {
  try {
      const products = await productModel.find();
      console.log(products);
      res.render('home', { products: JSON.parse(JSON.stringify(products)) });
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
  
      res.render('cart', { cart });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});
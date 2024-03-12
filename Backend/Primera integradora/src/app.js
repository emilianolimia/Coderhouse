const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const { default: productModel } = require('./models/product');
const { default: cartModel } = require('./models/cart');

const app = express();
const port = 8080;

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketio(server);

// Inicialización de managers
const cartManager = new CartManager('../carrito.json');

// Inicialización del servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en ${port}`);
});

// Manejo de conexión de sockets
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Manejo de eventos de creación de producto
  socket.on('productCreated', () => {
    io.emit('productListUpdated');
  });

  // Manejo de eventos de eliminación de producto
  socket.on('productDeleted', () => {
    io.emit('productListUpdated');
  });
});

// Rutas
app.get('/', async (req, res) => {
  try {
    await productManager.init();
    const products = await productModel.find();
    res.render('home', { products });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    await productManager.init();
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.use(express.json());

// Rutas para productos
app.get('/api/products', async (req, res) => {
  try {
    await productManager.init();

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    const products = await productManager.getProducts(limit);

    res.json({ products });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/products/:pid', async (req, res) => {
  try {
    await productManager.init();

    const productId = parseInt(req.params.pid, 10);
    const product = productModel.findById(productId);

    if (product) {
      res.json({ product });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    await productManager.init();

    const product = req.body;

    // Validar campos obligatorios
    if (!product.title || !product.description || !product.code || !product.price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    // Agregar el producto
    const newProduct = await productModel.create(product);

    res.status(201).json({ product: newProduct });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/products/:pid', async (req, res) => {
  try {
    await productManager.init();

    const productId = parseInt(req.params.pid, 10);
    const updatedFields = req.body;

    // Verificar si el producto existe
    const existingProduct = await productManager.getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar el producto
    await productManager.updateProduct(productId, updatedFields);

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  try {
    await productManager.init();

    const productId = parseInt(req.params.pid, 10);

    // Verificar si el producto existe
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar el producto
    await productManager.deleteProduct(productId);

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas para carritos

app.post('/api/carts', async (req, res) => {
  try {
    await cartManager.init();

    // Crear un nuevo carrito
    const newCart = await cartManager.addCart({});

    res.status(201).json({ cart: newCart });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/carts/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid, 10);

    // Obtener el carrito por ID
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json({ cart });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    const { quantity } = req.body;

    // Verificar si el carrito existe
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Verificar si el producto existe en la base de datos de productos
    const index = cart.products.findIndex(product => product.id == productId);
    if (index != -1) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    // Agregar el producto al carrito
    await cartModel.findByIdAndUpdate(cartId, productId, quantity);

    res.json({ message: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
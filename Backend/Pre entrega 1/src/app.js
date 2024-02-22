const express = require('express');
const ProductManager = require('./productManager');
const CartManager = require('./cartManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('../productos.json');
const cartManager = new CartManager('../carrito.json');

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
    const product = productManager.getProductById(productId);

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

    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Validar campos obligatorios
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    // Agregar el producto
    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails: thumbnails || [], // Si no se proporciona, asignar un array vacío
    });

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
    const existingProduct = await productManager.getProductById(productId);
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
    await cartManager.init();

    const cartId = parseInt(req.params.cid, 10);

    // Obtener el carrito por ID
    const cart = await cartManager.getCartById(cartId);
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
    await productManager.init();
    await cartManager.init();

    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    const { quantity } = req.body;

    // Verificar si el carrito existe
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Verificar si el producto existe en la base de datos de productos
    const product = productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    // Agregar el producto al carrito
    await cartManager.addProductToCart(cartId, productId, quantity);

    res.json({ message: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en ${port}`);
});
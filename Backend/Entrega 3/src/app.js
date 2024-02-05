// En app.js

const express = require('express');
const ProductManager = require('./productManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('./productos.json');

app.use(express.json());

app.get('/products', async (req, res) => {
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

app.get('/products/:pid', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Servidor corriendo en ${port}`);
});

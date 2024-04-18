const express = require('express');
const router = express.Router();
const cartModel = require('../models/cart');

// Definir las rutas para el manejo de carritos
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
        const carts = await cartModel.find();
    
        res.json({ carts });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
    
        // Obtener el carrito por ID con los productos completos mediante "populate"
        const cart = await cartModel.findById(cartId).populate('products.id_prod');
        if (!cart) {
          return res.status(404).json({ error: 'Carrito no encontrado' });
        }
    
        res.json({ cart });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        // Crear un nuevo carrito
        const newCart = await cartModel.create({ products: []});
    
        res.status(201).json({ cart: newCart });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { quantity } = req.body;
  
      // Verificar si el carrito existe
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      // Verificar si el producto existe en la base de datos de productos
     const index = cart.products.findIndex(product => product.id_prod == productId);
      if (index != -1) {
        // return res.status(404).json({ error: 'El producto no existe' });
        cart.products[index].quantity = quantity;
      } else {
        cart.products.push({ id_prod: productId, quantity: quantity});
      }
  
      // Agregar el producto al carrito
      await cartModel.findByIdAndUpdate(cartId, cart);
  
      res.json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        // Verificar si el carrito existe
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Buscar el producto en el carrito y actualizar su cantidad
        const productIndex = cart.products.findIndex(product => product.id_prod == productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        // Actualizar el carrito en la base de datos
        await cartModel.findByIdAndUpdate(cartId, cart);

        res.json({ message: 'Cantidad de ejemplares actualizada correctamente' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        // Eliminar el carrito de la base de datos
        await cartModel.findByIdAndDelete(cartId);

        res.json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Verificar si el carrito existe
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Filtrar los productos del carrito para excluir el producto a eliminar
        cart.products = cart.products.filter(product => product.id_prod != productId);

        // Actualizar el carrito en la base de datos
        await cartModel.findByIdAndUpdate(cartId, cart);

        res.json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
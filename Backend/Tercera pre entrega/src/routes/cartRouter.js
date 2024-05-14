const express = require('express');
const router = express.Router();
const CartRepository = require('../repositories/cartRepository');
const ProductService = require('../services/productService');
const TicketService = require('../services/ticketService');
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');

// Middleware de autorización para permitir solo a los usuarios acceder a estas rutas
router.use(authorizationMiddleware.isUser);

router.get('/', async (req, res) => {
    try {
        const carts = await CartRepository.getAllCarts();
        res.json({ carts });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartRepository.getCartById(cartId);
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
        const newCart = await CartRepository.createCart();
        res.status(201).json({ cart: newCart });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const { quantity } = req.body;
      await CartRepository.addProductToCart(cartId, productId, quantity);
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
        await CartRepository.updateProductQuantity(cartId, productId, quantity);
        res.json({ message: 'Cantidad de ejemplares actualizada correctamente' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await CartRepository.deleteCart(cartId);
        res.json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        await CartRepository.removeProductFromCart(cartId, productId);
        res.json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Definición de la función para calcular el monto total de la compra
function calculateTotalAmount(productsToUpdate) {
    let totalAmount = 0;
    for (const product of productsToUpdate) {
        // Suponiendo que cada producto tenga un precio y una cantidad
        totalAmount += product.price * product.quantity;
    }
    return totalAmount;
}

router.post('/:cid/purchase', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartRepository.getCartById(cartId);

        // Verificar el stock de los productos en el carrito
        const productsToUpdate = [];
        const productsNotPurchased = [];
        for (const item of cart.products) {
            const product = await ProductService.getProductById(item.id_prod);
            if (product.stock >= item.quantity) {
                // Si hay suficiente stock, restar del inventario
                product.stock -= item.quantity;
                productsToUpdate.push(product);
            } else {
                // Si no hay suficiente stock, agregar a la lista de productos no comprados
                productsNotPurchased.push(item.id_prod);
            }
        }

        // Actualizar el stock de los productos en la base de datos
        await ProductService.updateProducts(productsToUpdate);

        // Generar el ticket con los datos de la compra
        const ticketData = {
            code: TicketService.generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: calculateTotalAmount(productsToUpdate), // Debes definir esta función
            purchaser: req.user.email
        };
        const ticket = await TicketService.createTicket(ticketData);

        // Actualizar el carrito del usuario
        await CartRepository.updateCart(cartId, productsNotPurchased);

        // Enviar la respuesta
        res.status(200).json({ message: 'Compra realizada con éxito', ticket });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
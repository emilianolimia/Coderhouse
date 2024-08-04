/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - products
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the cart
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_prod:
 *                 type: string
 *               quantity:
 *                 type: number
 *       example:
 *         id: d5fE_asz
 *         products:
 *           - id_prod: product_id_1
 *             quantity: 2
 *           - id_prod: product_id_2
 *             quantity: 1
 */

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: The carts managing API
 */

/**
 * @swagger
 * /carts:
 *   get:
 *     summary: Returns the list of all the carts
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: The list of the carts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 */

/**
 * @swagger
 * /carts/{cid}:
 *   get:
 *     summary: Get the cart by id
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *     responses:
 *       200:
 *         description: The cart description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: The cart was not found
 */

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: The cart was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /carts/{cid}/product/{pid}:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: The product was added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: The cart or product was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /carts/{cid}/product/{pid}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was removed from the cart
 *       404:
 *         description: The cart or product was not found
 *       500:
 *         description: Some error happened
 */

const express = require('express');
const router = express.Router();
const CartRepository = require('../repositories/cartRepository');
const ProductService = require('../services/productService');
const TicketService = require('../services/ticketService');
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');
const logger = require('../utils/logger');

// Middleware de autorización para permitir solo a los usuarios acceder a estas rutas
router.use(authorizationMiddleware.isUser);

router.get('/', async (req, res) => {
    try {
        const carts = await CartRepository.getAllCarts();
        res.json({ carts });
        logger.info('Carts retrieved successfully');
    } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error retrieving carts: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CartRepository.getCartById(cartId);
        if (!cart) {
            logger.warn(`Cart not found: ${cartId}`);
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ cart });
        logger.info(`Cart retrieved successfully: ${cartId}`);
    } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error retrieving cart: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await CartRepository.createCart();
        res.status(201).json({ cart: newCart });
        logger.info('New cart created successfully');
    } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error creating new cart: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/:cid/product/:pid', authorizationMiddleware.isNotAdmin, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        // Validar que se haya proporcionado una cantidad y que sea mayor a cero
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }

        // Verificar si el usuario premium está intentando agregar su propio producto
        const product = await ProductService.getProductById(productId);
        if (req.user.role === 'premium' && product.owner === req.user.email) {
            return res.status(403).json({ error: 'No puedes agregar tu propio producto al carrito' });
        }
        
        await CartRepository.addProductToCart(cartId, productId, quantity);
        res.json({ message: 'Producto agregado al carrito correctamente' });
        logger.info(`Product ${productId} added to cart ${cartId}`);
    } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error adding product to cart: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { productId, quantity } = req.body;
        await CartRepository.updateProductQuantity(cartId, productId, quantity);
        res.json({ message: 'Cantidad de ejemplares actualizada correctamente' });
        logger.info(`Product quantity updated in cart ${cartId}`);
    } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error updating product quantity in cart ${cartId}: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar cantidad del producto en el carrito
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }

        await CartRepository.updateProductQuantity(cartId, productId, quantity);
        res.json({ message: 'Cantidad actualizada correctamente' });
        logger.info(`Product ${productId} quantity updated in cart ${cartId}`);
    } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error updating product quantity in cart: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        await CartRepository.deleteCart(cartId);
        res.json({ message: 'Carrito eliminado correctamente' });
        logger.info(`Cart ${cartId} deleted successfully`);
    } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error deleting cart ${cartId}: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        await CartRepository.removeProductFromCart(cartId, productId);
        res.json({ message: 'Producto eliminado del carrito correctamente' });
        logger.info(`Product ${productId} removed from cart ${cartId}`);
    } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error removing product from cart: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Definición de la función para calcular el monto total de la compra
function calculateTotalAmount(products) {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
}

router.post('/:cid/purchase', async (req, res) => {
    try {
        const cartId = req.session.user.cart;
        const cart = await CartRepository.getCartById(cartId);

        if (!cart) {
            logger.warn(`Cart not found: ${cartId}`);
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Verificar el stock de los productos en el carrito
        const productsToUpdate = [];
        const productsNotPurchased = [];
        const productsPurchased = [];

        for (const item of cart.products) {
            const product = await ProductService.getProductById(item.id_prod);

            if (product.stock >= item.quantity) {
                // Si hay suficiente stock, restar del inventario y agregar al proceso de compra
                product.stock -= item.quantity;
                productsToUpdate.push(product);
                productsPurchased.push({ ...product._doc, quantity: item.quantity });
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
            amount: calculateTotalAmount(productsPurchased),
            purchaser: req.user.email
        };

        const ticket = await TicketService.createTicket(ticketData);

        // Actualizar el carrito del usuario
        cart.products = cart.products.filter(item => productsNotPurchased.includes(item.id_prod));
        await cart.save();

        // Enviar la respuesta
        logger.info(`Purchase completed for cart ${cartId}`);
        res.status(200).json({ message: 'Compra realizada con éxito', ticket, productsNotPurchased });
    } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error completing purchase for cart ${cartId}: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         title:
 *           type: string
 *           description: The title of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         owner:
 *           type: string
 *           description: The owner of the product
 *       example:
 *         id: d5fE_asz
 *         title: Product title
 *         description: Product description
 *         price: 99.99
 *         owner: user@example.com
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update the product by the id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 */

const express = require('express');
const router = express.Router();
const ProductRepository = require('../repositories/productRepository');
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');
const generateMockProducts = require('../utils/mockingProducts');
const validateProduct = require('../middlewares/validateProduct');
const logger = require('../utils/logger');

// Middleware de autorización para permitir solo a los administradores acceder a estas rutas
router.use(authorizationMiddleware.isAdmin);

router.get('/', async (req, res) => {
    try {
        const products = await ProductRepository.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/mockingproducts', (req, res) => {
  const mockProducts = generateMockProducts();
  res.json(mockProducts);
});

router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductRepository.getProductById(productId);
    
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

router.post('/', authorizationMiddleware.isPremiumOrAdmin, validateProduct, async (req, res) => {
    try {
        const productDTO = req.body;
        const newProduct = await ProductRepository.createProduct(productDTO);
        res.status(201).send(newProduct);
        logger.info(`Product created successfully: ${product._id}`);
      } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error creating product: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
});

router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProductDTO = req.body;
        await ProductRepository.updateProduct(productId, updatedProductDTO);
        res.json({ message: 'Producto actualizado correctamente' });
        logger.info(`Product updated successfully: ${productId}`);
      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
});

router.delete('/:id', authorizationMiddleware.isPremiumOrAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        await ProductRepository.deleteProduct(productId);
        res.json({ message: 'Producto eliminado correctamente' });
        logger.info(`Product deleted successfully: ${productId}`);
      } catch (error) {
        console.error('Error:', error.message);
        logger.error(`Error deleting product ${productId}: ${error.message}`);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
});

module.exports = router;
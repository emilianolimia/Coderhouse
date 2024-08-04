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
const User = require('../models/userModel');
const nodemailer = require('nodemailer'); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

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
        const cartId = req.session.cartId;
    
        if (product) {
          res.render('productDetails', { product: JSON.parse(JSON.stringify(product)), cartId });
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
    productDTO.owner = req.user._id; // Asigna el ID del usuario como owner del producto
    const newProduct = await ProductRepository.createProduct(productDTO);
    res.status(201).send(newProduct);
    logger.info(`Product created successfully: ${newProduct._id}`);
  } catch (error) {
    console.error('Error:', error.message);
    logger.error(`Error creating product: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', authorizationMiddleware.isPremiumOrAdmin, async (req, res) => {
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

router.delete('/:id', authorizationMiddleware.isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductRepository.getProductById(productId);
        
        if (!product) {
          return res.status(404).json({ message: 'Producto no encontrado' });
        }
    
        const user = await User.findById(product.owner);

        if (user && user.role === 'premium') {
          const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Producto Eliminado',
            text: `Estimado/a ${user.first_name}, su producto "${product.title}" ha sido eliminado.`
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error al enviar el correo:', error);
            } else {
              console.log('Correo enviado:', info.response);
            }
          });
        }
    
        await ProductRepository.deleteProductById(productId);
    
        res.status(200).json({ message: 'Producto eliminado correctamente' });
        
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        logger.error(`Error deleting product ${productId}: ${error.message}`);
        res.status(500).json({ message: 'Error al eliminar el producto' });
      }
});

module.exports = router;
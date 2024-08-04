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
const express = require('express');
const router = express.Router();
const productModel = require('../models/product');

router.get('/', async (req, res) => {
    try {
        // Recuperar los parámetros de consulta
        const { limit = 10, page = 1, sort, query } = req.query;
        
        // Crear un objeto de opciones para la consulta
        const options = {
          limit: parseInt(limit, 10),
          page: parseInt(page, 10),
          sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
        };
    
        // Crear un objeto de filtro si está presente el parámetro query
        const filter = query ? { title: { $regex: query, $options: 'i' } } : {};
    
        // Realizar la consulta a la base de datos
        const products = await productModel.paginate(filter, options);
    
        res.json({ 
            status: 'success', 
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevPage ? `${req.baseUrl}?limit=${limit}&page=${products.prevPage}` : null,
            nextLink: products.nextPage ? `${req.baseUrl}?limit=${limit}&page=${products.nextPage}` : null
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
  
// app.get('/realtimeproducts', async (req, res) => {
//     try {
//         const products = await productManager.getProducts();
//         res.render('realTimeProducts', { products });
//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).send('Error interno del servidor');
//     }
// });

router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productModel.findById(productId).lean();
    
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

router.post('/', async (req, res) => {
    try {
        const product = req.body;
    
        // Validar campos obligatorios
        if (!product.title || !product.description || !product.code || !product.category || !product.price || !product.stock) {
          return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }
    
        // Agregar el producto
        const newProduct = await productModel.create(product);
        res.status(201).send(newProduct);
    
      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
});

router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;
    
        // Verificar si el producto existe
        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
    
        // Actualizar el producto
        await productModel.findByIdAndUpdate(productId, updatedFields);
    
        res.json({ message: 'Producto actualizado correctamente' });
      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
});

router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.pid;
    
        // Verificar si el producto existe
        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
    
        // Eliminar el producto
        await productModel.findByIdAndDelete(productId);
    
        res.json({ message: 'Producto eliminado correctamente' });
      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
});

module.exports = router;
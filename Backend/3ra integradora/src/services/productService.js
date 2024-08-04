const Product = require('../models/product');
const errorCodes = require('../utils/errorCodes');
const logger = require('../utils/logger');

class ProductService {
    static async getProductById(productId) {
        try {
            return await Product.findById(productId);
        } catch (error) {
            logger.error(`Error al obtener el producto por ID: ${error.message}`);
            throw new Error('Error al obtener el producto por ID');
        }
    }

    static async updateProducts(productsToUpdate) {
        try {
            const promises = productsToUpdate.map(product => product.save());
            return await Promise.all(promises);
        } catch (error) {
            logger.error(`Error al actualizar los productos: ${error.message}`);
            throw new Error('Error al actualizar los productos');
        }
    }

    static async createProduct(productData, user) {
        try {
            const owner = user.role === 'premium' ? user.email : 'admin';
            const product = new Product({ ...productData, owner });
            return await product.save();
        } catch (error) {
            logger.error(`Error al crear el producto: ${error.message}`);
            throw new Error('Error al crear el producto');
        }
    }

    static async updateProduct(productId, productData) {
        try {
            return await Product.findByIdAndUpdate(productId, productData, { new: true });
        } catch (error) {
            logger.error(`Error al actualizar el producto: ${error.message}`);
            throw new Error('Error al actualizar el producto');
        }
    }

    static async deleteProduct(productId, user) {
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            if (user.role !== 'admin' && product.owner !== user.email) {
                throw new Error('No tienes permisos para eliminar este producto');
            }

            return await product.remove();
        } catch (error) {
            logger.error(`Error al eliminar el producto: ${error.message}`);
            throw new Error('Error al eliminar el producto');
        }
    }
}

module.exports = ProductService;
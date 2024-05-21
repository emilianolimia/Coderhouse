const Product = require('../models/product');
const errorCodes = require('../utils/errorCodes');

class ProductService {
  static async getProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch (error) {
      throw new Error('Error al obtener el producto por ID');
    }
  }

  static async updateProducts(productsToUpdate) {
    try {
      const promises = productsToUpdate.map(product => product.save());
      return await Promise.all(promises);
    } catch (error) {
      throw new Error('Error al actualizar los productos');
    }
  }

  static async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error('Error al crear el producto');
    }
  }
}

module.exports = ProductService;
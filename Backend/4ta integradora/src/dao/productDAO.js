const ProductModel = require('../models/product');
const ProductDTO = require('../dto/productDTO');

class ProductDAO {
  async createProduct(productDTO) {
    const product = new ProductModel(productDTO);
    return await product.save();
  }

  async getProductById(productId) {
    return await ProductModel.findById(productId);
  }

  async updateProductById(productId, newData) {
    return await ProductModel.findByIdAndUpdate(productId, newData, { new: true });
  }

  async deleteProductById(productId) {
    return await ProductModel.findByIdAndDelete(productId);
  }
}

module.exports = new ProductDAO();
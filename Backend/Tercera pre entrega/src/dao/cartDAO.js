const CartModel = require('../models/cart');
const CartDTO = require('../dto/cartDTO');

class CartDAO {
  async createCart(cartDTO) {
    const cart = new CartModel(cartDTO);
    return await cart.save();
  }

  async getCartById(cartId) {
    return await CartModel.findById(cartId);
  }

  async updateCartById(cartId, newData) {
    return await CartModel.findByIdAndUpdate(cartId, newData, { new: true });
  }

  async deleteCartById(cartId) {
    return await CartModel.findByIdAndDelete(cartId);
  }
}

module.exports = new CartDAO();
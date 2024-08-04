const CartModel = require('../models/cart');

class CartRepository {
  async createCart() {
    const cart = new CartModel({ products: [] });
    return await cart.save();
  }

  async getCartById(cartId) {
    return await CartModel.findById(cartId).populate('products.id_prod');
  }

  async updateCartById(cartId, newData) {
    return await CartModel.findByIdAndUpdate(cartId, newData, { new: true });
  }

  async deleteCartById(cartId) {
    return await CartModel.findByIdAndDelete(cartId);
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(product => product.id_prod == productId);

    if (existingProductIndex !== -1) {
      // Actualizar la cantidad si el producto ya está en el carrito
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Agregar el producto al carrito si es nuevo
      cart.products.push({ id_prod: productId, quantity });
    }

    // Guardar el carrito actualizado
    return await cart.save();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // Buscar el producto en el carrito y actualizar su cantidad
    const product = cart.products.find(product => product.id_prod == productId);

    if (product) {
      product.quantity = quantity;
    } else {
      throw new Error('Producto no encontrado en el carrito');
    }

    // Guardar el carrito actualizado
    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // Filtrar los productos del carrito para excluir el producto a eliminar
    cart.products = cart.products.filter(product => product.id_prod != productId);

    // Guardar el carrito actualizado
    return await cart.save();
  }
}

module.exports = new CartRepository();
const fs = require('fs').promises;

class CartManager {
  constructor(filePath) {
    this.carts = [];
    this.nextId = 1;
    this.path = filePath;
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      this.carts = JSON.parse(data);
      this.nextId = this.calculateNextId();
    } catch (error) {
      console.error('Error al leer o parsear la información del carrito:', error.message);
    }
  }

  async saveCartsToFile() {
    const data = JSON.stringify(this.carts, null, 2);
    await fs.writeFile(this.path, data, 'utf8');
  }

  calculateNextId() {
    if (this.carts.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.carts.map(cart => cart.id));
    return maxId + 1;
  }

  addCart(cart) {
    const newCart = {
      id: this.nextId++,
      products: [],
      ...cart,
    };

    this.carts.push(newCart);
    this.saveCartsToFile();

    console.log('Carrito agregado:', newCart);
    return newCart;
  }

  getCartById(id) {
    const cart = this.carts.find(c => c.id === id);

    if (cart) {
      return cart;
    } else {
      console.error('Carrito no encontrado.');
      return null;
    }
  }

  addProductToCart(cartId, productId, quantity) {
    const cart = this.getCartById(cartId);
    if (!cart) {
      console.error('Carrito no encontrado.');
      return;
    }

    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    this.saveCartsToFile();
    console.log(`Producto agregado al carrito ${cartId}:`, { productId, quantity });
  }
}

module.exports = CartManager;
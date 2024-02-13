const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.products = [];
    this.nextId = 1;
    this.path = filePath;
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      this.products = JSON.parse(data);
      this.nextId = this.calculateNextId();
    } catch (error) {
      console.error('Error al leer o parser la información del producto: ', error.message);
    }
  }

  async saveProductsToFile() {
    const data = JSON.stringify(this.products, null, 2);  // El segundo parámetro, llamado replacer, se utiliza para transformar el resultado. 
    await fs.writeFile(this.path, data, 'utf8');            // El tercer parámetro, llamado space, se utiliza para la sangría (indentación) en la cadena JSON. 
  }

  calculateNextId() {
    if (this.products.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.products.map(product => product.id));
    return maxId + 1;
  }

  addProduct(product) {
    // Establecer status como true por defecto si no se proporciona
    const productWithDefaults = {
        status: true,
        ...product
    };

    // Validar que todos los campos sean obligatorios
    if (!productWithDefaults.title || !productWithDefaults.description || !productWithDefaults.price || !productWithDefaults.thumbnails || !productWithDefaults.code || !productWithDefaults.stock) {
        console.error('Todos los campos son obligatorios.');
        return;
    }

    // Validar que no se repita el campo "code"
    if (this.products.some(p => p.code === productWithDefaults.code)) {
        console.error('Ya existe un producto con ese código.');
        return;
    }

    // Agregar el producto al arreglo con un id autoincrementable
    const newProduct = {
        id: this.nextId++,
        ...productWithDefaults, // Se copian todas las propiedades de productWithDefaults en newProduct
    };

    this.products.push(newProduct);
    this.saveProductsToFile();

    console.log('Producto agregado:', newProduct);
    return newProduct
  }

  getProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);

    if (product) {
      return product;
    } else {
      console.error('Producto no encontrado.');
      return null;
    }
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(p => p.id === id);

    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields }; // Esta es una manera eficiente de actualizar un objeto dentro de un array, manteniendo las propiedades originales y aplicando actualizaciones específicas proporcionadas en updatedFields
      this.saveProductsToFile();
      console.log('Producto actualizado:', this.products[index]);
    } else {
      console.error('Producto no encontrado para actualizar.');
    }
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);

    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0]; // Se elimina 1 elemento del array this.products a partir de la posición index
      this.saveProductsToFile();
      console.log('Producto eliminado:', deletedProduct);
    } else {
      console.error('Producto no encontrado para eliminar.');
    }
  }
}

module.exports = ProductManager;

// PROCESO DE TESTING
// http://localhost:8080/products
// http://localhost:8080/products?limit=5 
// http://localhost:8080/products/2 
// http://localhost:8080/products/34123123 
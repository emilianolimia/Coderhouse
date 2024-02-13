const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.products = [];
    this.nextId = 1;
    this.path = filePath;
    this.loadProductsFromFile();
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      if (!Array.isArray(this.products)) {  // Se verifica si this.products no es un array
        this.products = [];
      }
    } catch (error) {
      this.products = [];
    }
  }

  saveProductsToFile() {
    const data = JSON.stringify(this.products, null, 2);  // El segundo parámetro, llamado replacer, se utiliza para transformar el resultado. 
    fs.writeFileSync(this.path, data, 'utf8');            // El tercer parámetro, llamado space, se utiliza para la sangría (indentación) en la cadena JSON. 
  }

  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    // Validar que no se repita el campo "code"
    if (this.products.some(p => p.code === product.code)) {
      console.error('Ya existe un producto con ese código.');
      return;
    }

    // Agregar el producto al arreglo con un id autoincrementable
    const newProduct = {
      id: this.nextId++,
      ...product, // Se copian todas las propiedades de product en newProduct
    };

    this.products.push(newProduct);
    this.saveProductsToFile();

    console.log('Producto agregado:', newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);

    if (product) {
      return product;
    } else {
      console.error('Producto no encontrado.');
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

// // PROCESO DE TESTING
// // Crear una instancia de la clase "ProductManager"
// const manager = new ProductManager('productos.json');

// // Llamar al método "getProducts", debe devolver un arreglo vacío []
// console.log(manager.getProducts());

// // Llamar al método "addProduct" con los campos especificados
// manager.addProduct({
//   title: 'producto prueba',
//   description: 'Este es un producto prueba',
//   price: 200,
//   thumbnail: 'Sin imagen',
//   code: 'abc123',
//   stock: 25,
// });

// // Llamar al método "getProducts" nuevamente, esta vez debe aparecer el producto recién agregado
// console.log(manager.getProducts());

// const productId = 1;

// // Evaluar que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
// console.log(manager.getProductById(productId));

// // Se intenta cambiar un campo, y se evalua que no se elimine el id y que sí se haya hecho la actualización
// console.log(manager.updateProduct(productId, { price: 250, stock: 30 }));

// // Borrar prodcuto
// manager.deleteProduct(productId);

// // Chequear que el producto se haya borrado correctamente
// console.log(manager.getProducts());
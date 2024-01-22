class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Validar que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error('Todos los campos son obligatorios.');
      return;
    }

    // Validar que no se repita el campo "code"
    if (this.products.some(product => product.code === code)) {
      console.error('Ya existe un producto con ese código.');
      return;
    }

    // Agregar el producto al arreglo con un id autoincrementable
    const newProduct = {
      id: this.nextId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.nextId++;

    console.log('Producto agregado:', newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);

    if (product) {
      return product;
    } else {
      console.error('Producto no encontrado.');
    }
  }
}

// Crear una instancia de la clase "ProductManager"
const manager = new ProductManager();

// Llamar al método "getProducts", debe devolver un arreglo vacío []
console.log(manager.getProducts());

// Llamar al método "addProduct" con los campos especificados
manager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);

// Llamar al método "getProducts" nuevamente, esta vez debe aparecer el producto recién agregado
console.log(manager.getProducts());

// Llamar al método "addProduct" con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
manager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);

// Evaluar que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
console.log(manager.getProductById(1));
console.log(manager.getProductById(999));
const socket = io();

socket.on('productListUpdated', () => {
  location.reload();
});

function createProduct() {
  // Lógica para enviar solicitud POST al crear un producto
}

function deleteProduct(productId) {
  // Lógica para enviar solicitud DELETE al eliminar un producto
}
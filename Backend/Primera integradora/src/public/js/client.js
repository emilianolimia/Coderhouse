const socket = io();
let user = 'anon'; // Falta agregar SweetAlert para identificación
let chatBox = document.getElementById('chatBox');

chatBox.addEventListener('keyup', event => {
  if(event.key === "Enter"){
    if(chatBox.ariaValueMax.trim().length > 0) {
      socket.emit("message", {user:user, message:chatBox.value})
    }
  }
})

socket.on('messageLogs', data => {
  let log = document.getElementById('messageLogs');
  let messages = "";
  data.forEach(message => {
    messages = messages + `${message.user} dice: ${message.message} </br>`
  });
  log.innerHTML = messages;
})

socket.on('productListUpdated', () => {
  location.reload();
});

function createProduct() {
  // Lógica para enviar solicitud POST al crear un producto
}

function deleteProduct(productId) {
  // Lógica para enviar solicitud DELETE al eliminar un producto
}
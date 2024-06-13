const express = require('express');
const router = express.Router();
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');

// Middleware de autorización para permitir solo a los usuarios acceder a esta ruta
router.use(authorizationMiddleware.isUser);

// Ruta para enviar mensajes al chat
router.post('/send-message', async (req, res) => {
    // Lógica para enviar un mensaje al chat
});

module.exports = router;
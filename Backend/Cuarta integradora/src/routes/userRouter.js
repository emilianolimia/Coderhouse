const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');
const upload = require('../middlewares/multerConfig');

// Middleware de autorización
router.use(authorizationMiddleware.isUser);

// Ruta para cambiar el rol de un usuario
router.put('/premium/:uid', authorizationMiddleware.isPremium, UserController.changeUserRole);

// Ruta para subir documentos
router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 1 },
    { name: 'document', maxCount: 3 }
  ]), UserController.uploadDocuments);

module.exports = router;
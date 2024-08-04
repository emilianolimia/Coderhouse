const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');
const upload = require('../middlewares/multerConfig');

// Ruta para subir documentos
router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 1 },
    { name: 'document', maxCount: 3 }
]), UserController.uploadDocuments);

// Ruta para obtener todos los usuarios
router.get('/', authorizationMiddleware.isAdmin, UserController.getAllUsers);

// Ruta para eliminar usuarios inactivos
router.delete('/', authorizationMiddleware.isAdmin, UserController.deleteInactiveUsers);

// Ruta para actualizar el rol de un usuario
router.put('/:uid/role', authorizationMiddleware.isAdmin, UserController.updateUserRole);

// Ruta para eliminar un usuario
router.delete('/:uid', authorizationMiddleware.isAdmin, UserController.deleteUser);

module.exports = router;
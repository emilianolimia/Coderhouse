const express = require('express');
const router = express.Router();
const User = require('../models/user');
const logger = require('../config/logger');

// Cambiar el rol de un usuario
router.put('/premium/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Cambiar el rol del usuario
        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        logger.info(`Rol del usuario ${user.email} cambiado a ${user.role}`);
        res.json({ message: `Rol del usuario cambiado a ${user.role}` });
    } catch (error) {
        logger.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
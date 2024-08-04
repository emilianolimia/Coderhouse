const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class SessionController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            user.last_connection = new Date();
            await user.save();

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async logout(req, res) {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            user.last_connection = new Date();
            await user.save();

            res.status(200).json({ message: 'Logout exitoso' });
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = SessionController;
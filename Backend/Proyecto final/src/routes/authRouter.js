const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Página para solicitar restablecimiento de contraseña
router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword');
});

// Enviar correo para restablecer contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        logger.error(`Intento de restablecimiento de contraseña para un email no registrado: ${email}`);
        return res.status(400).json({ error: 'No existe un usuario con ese correo electrónico' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000; // 1 hora
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'no-reply@tuapp.com',
        to: user.email,
        subject: 'Restablecimiento de contraseña',
        text: `Recibió este correo electrónico porque usted (u otra persona) solicitó restablecer la contraseña de su cuenta.
               Por favor, haga clic en el siguiente enlace o péguelo en su navegador para completar el proceso dentro de una hora de recibido:
               http://${req.headers.host}/reset-password?token=${token}`
    };

    transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
            logger.error('Error al enviar el correo de restablecimiento de contraseña:', err);
            return res.status(500).json({ error: 'No se pudo enviar el correo de restablecimiento' });
        }
        res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado' });
    });
});

// Página para restablecer la contraseña
router.get('/reset-password', async (req, res) => {
    const { token } = req.query;

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        logger.warn(`Intento de restablecimiento de contraseña con token inválido o expirado: ${token}`);
        return res.render('forgotPassword', { error: 'El token es inválido o ha expirado' });
    }

    res.render('resetPassword', { token });
});

// Procesar el restablecimiento de contraseña
router.post('/reset-password', async (req, res) => {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('resetPassword', { token, error: 'Las contraseñas no coinciden' });
    }

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        logger.warn(`Intento de restablecimiento de contraseña con token inválido o expirado: ${token}`);
        return res.render('forgotPassword', { error: 'El token es inválido o ha expirado' });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
        return res.render('resetPassword', { token, error: 'No puede usar la misma contraseña anterior' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.render('resetPassword', { message: 'Contraseña restablecida con éxito' });
});

module.exports = router;
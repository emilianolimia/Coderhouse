const express = require('express');
const router = express.Router();

// Middleware para validar sesión
const checkSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

router.get('/', (req, res) => {
  res.render('login'); // Renderizar el formulario de login
});

router.get('/register', (req, res) => {
  res.render('register'); // Renderizar el formulario de registro
});

router.get('/profile', checkSession, (req, res) => {
  res.render('profile', { user: req.session.user }); // Renderizar el perfil del usuario
});

module.exports = router;
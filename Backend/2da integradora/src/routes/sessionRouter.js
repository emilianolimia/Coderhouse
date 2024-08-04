const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const passport = require('./passportConfig'); 
const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
  console.log('Middleware de redirección:', req.originalUrl);
  next();
});

// Rutas de login y registro
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log('Error en autenticación:', err);
      return next(err);
    }

    if (!user) {
      console.log('Login fallido:', info.message);
      return res.status(401).json({ message: info.message });
    }

    if (req.body.email === 'adminCoder@coder.com' && req.body.password === 'adminCod3r123') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log('Error en req.logIn:', err);
        return next(err);
      }

      req.session.user = user;
      console.log('Login exitoso');
      return res.status(200).json({ message: 'Login exitoso', user });
    });
  })(req, res, next);
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      age: req.body.age,
      password: hashedPassword,
    });
    await newUser.save();
    console.log('Usuario registrado con éxito:', newUser);
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Cierre de sesión exitoso' });
});

router.get('/login/github', (req, res, next) => {
  console.log('Llegando a /login/github');
  next();
}, passport.authenticate('github'));

router.get('/login/github/callback', (req, res, next) => {
  passport.authenticate('github', (err, user) => {
    if (err) {
      console.error('Error en la autenticación:', err);
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error en req.logIn:', err);
        return next(err);
      }
      return res.status(200).json({ message: 'Usuario autenticado con éxito', user });
    });
  })(req, res, next);
});

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  res.status(401).json({ message: 'No autenticado' });
};

// Ruta para obtener el usuario actual
router.get('/current', exports.isAuthenticated, (req, res) => {
  try {
    // Devuelve el usuario actual sin incluir la contraseña
    const { password, ...currentUser } = req.user.toObject();
    res.status(200).json(currentUser);
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Manejo de errores
router.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = router;
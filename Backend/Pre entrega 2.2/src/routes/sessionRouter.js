console.log('Accediendo a sessionRouter.js');

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

// Configuración de Passport para autenticación local
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Validación interna para el usuario admin
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      return done(null, {
        _id: 'admin',
        first_name: 'Admin',
        last_name: 'Coder',
        email: 'adminCoder@coder.com',
        age: 0,
        role: 'admin',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario recuperado:', user);
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    // Agregar el campo 'role' al objeto 'user'
    const userWithRole = {
      ...user.toObject(),
      role: user.role || 'usuario'  // Se define 'usuario' por defecto si no hay un campo 'role'
    };

    return done(null, userWithRole);

  } catch (error) {
    return done(error);
  }
}));

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
  passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/api/sessions/login',
    failureFlash: true
  }, (err, user, info) => {
    if (err) {
      console.log('Error en autenticación:', err);
      return next(err);
    }

    if (!user) {
      console.log('Login fallido:', info.message);
      return res.redirect('/api/sessions/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log('Error en logIn:', err);
        return next(err);
      }

      req.session.user = user;
      console.log('Login exitoso');
      return res.redirect('/products');
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
      console.log('Usuario no encontrado, redirigiendo al login');
      return res.redirect('/api/sessions/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error en req.logIn:', err);
        return next(err);
      }
      console.log('Usuario autenticado con éxito:', user);
      return res.redirect('/products');
    });
  })(req, res, next); // Aquí es donde se llama a la función middleware
});

module.exports = router;
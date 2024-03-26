const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const router = express.Router();

// Nueva ruta GET para el login
router.get('/login', (req, res) => {
  res.render('login'); // Renderiza la vista de login
});

router.get('/register', (req, res) => {
  res.render('register'); // Renderiza la vista de register
});

// Registrar usuario
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

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Intento de inicio de sesión para el email:', req.body.email);
    
    // Validación interna para el usuario admin
    if (req.body.email === 'adminCoder@coder.com' && req.body.password === 'adminCod3r123') {
      req.session.user = {
        _id: 'admin',  // Id ficticio para el admin
        first_name: 'Admin',
        last_name: 'Coder',
        email: 'adminCoder@coder.com',
        age: 0,
        role: 'admin',
      };
      console.log('Inicio de sesión exitoso como admin');
      return res.redirect('/products');
    }

    // Si no es el usuario admin, entonces verifica en la base de datos
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.email === 'adminCoder@coder.com' ? 'admin' : 'usuario',
      };
      console.log('Sesión establecida:', req.session.user);
      return res.redirect('/products');
    } 

    res.status(401).json({ error: 'Credenciales incorrectas' });

  } catch (error) {
    console.error('Error interno del servidor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Cierre de sesión exitoso' });
});

module.exports = router;
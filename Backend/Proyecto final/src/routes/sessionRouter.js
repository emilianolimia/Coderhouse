const express = require('express');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/userRepository'); // Importar el repositorio de usuario
const CartRepository = require('../repositories/cartRepository'); // Importar el repositorio de carrito
const UserMinimalDTO = require('../dto/userMinimalDTO'); // Importar el DTO minimal del usuario
const passport = require('../passportConfig');
const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

// router.use((req, res, next) => {
//   console.log('Middleware de redirección:', req.originalUrl);
//   next();
// });

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

    req.logIn(user, async (err) => {
      if (err) {
        console.log('Error en req.logIn:', err);
        return next(err);
      }

      // Nos aseguramos de que el carrito esté en la sesión del usuario
      if (!user.cart) {
        const newCart = await CartRepository.createCart();
        user.cart = newCart._id;
        await user.save();
      }

      req.session.user = user;
      req.session.cartId = user.cart;  // Asegura que el cartId esté en la sesión
      console.log('Login exitoso');
      res.redirect('/products');
    });
  })(req, res, next);
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUserDTO = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      age: req.body.age,
      password: hashedPassword,
      role: req.body.role,
    };

    const newUser = await UserRepository.createUser(newUserDTO);

    // Crear un carrito para el usuario
    const cart = await CartRepository.createCart(newUser._id);
    newUser.cart = cart._id;
    await newUser.save();

    console.log('Usuario registrado con éxito:', newUserDTO);
    res.redirect('/login');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    console.log('Cierre de sesión exitoso');
    res.redirect('/login');
  });
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

router.get('/current', exports.isAuthenticated, async (req, res) => {
  try {
    // Obtener la información mínima del usuario utilizando el UserRepository
    const currentUser = await UserRepository.getUserById(req.user._id);
    const currentUserDTO = new UserMinimalDTO(currentUser.first_name, currentUser.last_name, currentUser.age);

    // Verificar el carrito en la sesión
    console.log('Carrito en la sesión:', req.user.cart);
    
    // Enviar el DTO minimal del usuario
    res.status(200).json(currentUserDTO);
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = router;
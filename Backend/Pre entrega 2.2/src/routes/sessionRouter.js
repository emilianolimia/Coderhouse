const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
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

// Configuración de Passport para autenticación de GitHub
passport.use(new GitHubStrategy({
  clientID: '03f241eca066db0a891b',
  clientSecret: 'e6fdfdc307faa9522cdc49d6a4b3d9d2c3d9496a',
  callbackURL: 'http://localhost:8080/api/sessions/login/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Entrando en estrategia de GitHub');
    console.log('Profile:', profile);

    let user = await User.findOne({ email: profile._json.email });
    
    if (!user) {
      console.log('Creando nuevo usuario');
      user = new User({
        first_name: profile._json.name,
        email: profile._json.email,
        password: '', // Asignar password vacío
      });
      await user.save();
    } else {
      // Verificar si el password es vacío y actualizarlo si es necesario
      if (!user.password) {
        user.password = '';
        await user.save();
      }
    }

    console.log('Usuario encontrado o creado:', user);

    return done(null, user);

  } catch (error) {
    console.error('Error en estrategia de GitHub:', error);
    return done(error);
  }
}));

// Serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
  console.log('Serializando usuario:', user);
  done(null, {
    _id: user._id,
    role: user.role || 'usuario'  // Se define 'usuario' por defecto si no hay un campo 'role'
  });
});

passport.deserializeUser(async (data, done) => {
  try {
    const user = await User.findById(data._id);
    if (!user) {
      return done(null, false);
    }
    console.log('Deserializando usuario por ID:', user);
    done(null, {
      ...user.toObject(),
      role: data.role || 'usuario'  // Se define 'usuario' por defecto si no hay un campo 'role'
    });
  } catch (error) {
    done(error);
  }
});

router.use(passport.initialize());
router.use(passport.session());

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

router.get('/login/github', passport.authenticate('github'));

router.get('/login/github/callback', passport.authenticate('github', {
  successRedirect: '/products',
  failureRedirect: '/api/sessions/login',
  failureFlash: true
}), (req, res) => {
  console.log('Callback de GitHub exitoso');
});

module.exports = router;
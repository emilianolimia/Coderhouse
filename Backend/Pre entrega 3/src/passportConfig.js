require('dotenv').config();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/userModel');
const bcrypt = require('bcrypt');

// Estrategia GitHub
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/sessions/login/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Entrando en estrategia de GitHub');
    console.log('Profile:', profile);

    let user = await User.findOne({ email: profile._json.login });

    if (!user) {
      console.log('Creando nuevo usuario');
      const firstName = profile._json.name || profile.displayName || 'GitHubUser';
      user = new User({
        first_name: firstName,
        email: profile._json.login,
        password: '',
      });
      await user.save();
    }

    console.log('Usuario encontrado o creado:', user);

    return done(null, user);

  } catch (error) {
    console.error('Error en estrategia de GitHub:', error);
    return done(error);
  }
}));

// Estrategia Local
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    const userWithRole = {
      ...user.toObject(),
      role: user.role || 'usuario'
    };

    return done(null, userWithRole);

  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, {
    _id: user._id,
    role: user.role || 'usuario'
  });
});

passport.deserializeUser(async (data, done) => {
  try {
    const user = await User.findById(data._id);
    if (!user) {
      return done(null, false);
    }
    done(null, {
      ...user.toObject(),
      role: data.role || 'usuario'
    });
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
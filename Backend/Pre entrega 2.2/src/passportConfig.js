const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./models/userModel');

passport.use(new GitHubStrategy({
  clientID: '03f241eca066db0a891b',
  clientSecret: 'e6fdfdc307faa9522cdc49d6a4b3d9d2c3d9496a',
  callbackURL: 'http://localhost:8080/api/sessions/login/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Entrando en estrategia de GitHub');
        console.log('Profile:', profile);
    
        let user = await User.findOne({ email: profile._json.login });  // Cambia email a profile._json.login
        
        if (!user) {
            console.log('Creando nuevo usuario');
            // Generar una contraseña vacía
            const firstName = profile._json.name || profile.displayName || 'GitHubUser';
            user = new User({
                first_name: firstName,
                email: profile._json.login,  // Utilizar el login como email ficticio
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

passport.serializeUser((user, done) => {
  console.log('Serializando usuario:', user);
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
    console.log('Deserializando usuario por ID:', user);
    done(null, {
      ...user.toObject(),
      role: data.role || 'usuario'
    });
  } catch (error) {
    done(error);
  }
});

module.exports = passport;

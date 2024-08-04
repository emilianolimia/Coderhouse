const authorizationMiddleware = {
  isUser(req, res, next) {
    console.log('Ejecutando isUser');
    if (req.user && req.user.role === 'user') {
      next();
    } else {
      console.log('Usuario no autenticado');
      res.redirect('/login');
    }
  },

  isAdmin(req, res, next) {
    console.log('Ejecutando isAdmin');
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      console.log('Acceso denegado. Necesita tener rol de administrador.');
      res.redirect('/login');
    }
  },

  isNotAdmin(req, res, next) {
    console.log('Ejecutando isNotAdmin');
    if (req.user && req.user.role === 'admin') {
      return res.status(403).json({ message: 'Los administradores no pueden realizar compras.' });
    } else {
      next();
    }
  },

  isPremium(req, res, next) {
    console.log('Ejecutando isPremium');
    if (req.user && req.user.role === 'premium') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado. Necesita tener rol premium.' });
    }
  },

  isPremiumOrAdmin(req, res, next) {
    const user = req.user;
  
    if (user.role === 'premium' || user.role === 'admin') {
      return next();
    }
  
    res.status(403).json({ error: 'Acceso denegado' });
    console.log('Acceso denegado. Necesita tener rol premium o de administrador.');
  }
};

module.exports = authorizationMiddleware;
const authorizationMiddleware = {
  isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado' });
    }
  },

  isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado' });
    }
  },

  isPremium(req, res, next) {
    if (req.user && req.user.role === 'premium') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado' });
    }
  }
};

module.exports = authorizationMiddleware;
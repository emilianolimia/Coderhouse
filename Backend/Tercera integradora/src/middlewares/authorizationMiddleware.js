module.exports.isPremiumOrAdmin = (req, res, next) => {
  if (req.user.role === 'premium' || req.user.role === 'admin') {
      next();
  } else {
      res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
  }
};

module.exports.isUser = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.status(401).json({ error: 'No autorizado' });
  }
};
const logger = require('../utils/logger');

const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    } else {
      logger.warn('Unauthorized admin access attempt');
      return res.status(403).json({ error: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    }
  };
  
  const isUser = (req, res, next) => {
    if (req.user.role === 'user') {
      return next();
    } else {
      logger.warn('Unauthorized user access attempt');
      return res.status(403).json({ error: 'Acceso denegado. Esta acción solo está disponible para usuarios.' });
    }
  };
  
  module.exports = { isAdmin, isUser };  
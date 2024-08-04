const errorCodes = require('../utils/errorCodes');

const validateProduct = (req, res, next) => {
    const { title, description, category, stock, code, price } = req.body;
    const errors = [];
  
    if (!title) {
      errors.push({ field: 'title', message: 'El título es requerido.' });
    }
  
    if (!description) {
      errors.push({ field: 'description', message: 'La descripción es requerida.' });
    }
  
    if (!category) {
      errors.push({ field: 'category', message: 'La categoría es requerida.' });
    }
  
    if (stock == null) {
      errors.push({ field: 'stock', message: 'El stock es requerido.' });
    }
  
    if (!code) {
      errors.push({ field: 'code', message: 'El código es requerido.' });
    }
  
    if (!price) {
      errors.push({ field: 'price', message: 'El precio es requerido.' });
    }
  
    if (errors.length > 0) {
      return next({
        code: 'VALIDATION_ERROR',
        message: 'Errores de validación',
        details: errors
      });
    }
  
    next();
};  

module.exports = validateProduct;
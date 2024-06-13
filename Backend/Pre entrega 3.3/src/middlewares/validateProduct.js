const errorCodes = require('../utils/errorCodes');

const validateProduct = (req, res, next) => {
    const { name, price } = req.body;
    const errors = [];

    if (!name) {
        errors.push({ field: 'name', message: 'El nombre es requerido.' });
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
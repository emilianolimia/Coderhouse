const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err.code && err.message) {
        res.status(400).json({ error: err.code, message: err.message, details: err.details || [] });
    } else {
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: 'Error interno del servidor' });
    }
};

module.exports = errorHandler;
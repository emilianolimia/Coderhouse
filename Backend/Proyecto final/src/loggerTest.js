const express = require('express');
const router = express.Router();
const logger = require('./utils/logger');

// Endpoint para probar todos los logs
router.get('/loggerTest', (req, res) => {
    logger.debug('Debug log');
    logger.http('HTTP log');
    logger.info('Info log');
    logger.warn('Warning log');
    logger.error('Error log');
    logger.fatal('Fatal log');
    res.send('Logs generated, check your console and logs/errors.log file');
});

module.exports = router;
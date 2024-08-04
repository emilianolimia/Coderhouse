// utils/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define los niveles de prioridad
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
};

// Formato de los logs
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Crear el logger para desarrollo
const developmentLogger = createLogger({
    levels: customLevels.levels,
    format: combine(
        colorize({ all: true }),
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console({ level: 'debug' })
    ]
});

// Crear el logger para producción
const productionLogger = createLogger({
    levels: customLevels.levels,
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console({ level: 'info' }),
        new transports.File({ filename: 'logs/errors.log', level: 'error' })
    ]
});

// Exportar el logger adecuado según el entorno
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

module.exports = logger;
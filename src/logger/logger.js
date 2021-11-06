const winston = require('winston');
const path = require('path');

const options = {
    file: {
        level: process.env.LOG_LEVEL_FILE,
        format: winston.format.json(),
        filename: path.join(__dirname, '..', '..', 'app.log'),
    },
    console: {
        level: process.env.LOG_LEVEL_CONSOLE,
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    },
};

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [new winston.transports.File(options.file), new winston.transports.Console(options.console)],
    exitOnError: false,
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    },
};

module.exports = Object.freeze(logger);
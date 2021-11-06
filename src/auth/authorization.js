const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');
const createError = require('http-errors');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        logger.debug('Unauthorized request!');
        return next(new createError.Unauthorized('Unauthorized request!'));
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_STRING, (err, user) => {
        if (err) {
            if (err.message === 'jwt expired') {
                logger.debug('Token is expired!');
                return next(new createError.Unauthorized('Token is expired!'));
            } else {
                logger.debug('Forbidden request!');
                return next(new createError.Forbidden('Forbidden request!'));
            }
        }

        req.user = user;
        next();
    });
};
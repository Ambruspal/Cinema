const authHandlerService = require('./authHandler.service');
const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');
const createError = require('http-errors');

// Login user
exports.login = async(req, res, next) => {
    try {
        if (!req.body['email'] || !req.body['password']) {
            logger.debug(`Invalid request body: ${JSON.stringify(req.body)}! Login validation failed at client!`);
            return next(
                new createError.BadRequest(
                    `Invalid request body: ${JSON.stringify(req.body)}! Login validation failed at client!`
                )
            );
        }

        const { email, password } = req.body;

        const user = await authHandlerService.findOneByEmailAndPassword(email, password, next);

        if (!user) {
            logger.debug(`Not registered user with ${req.body.password} password!`);
            return next(new createError.NotFound(`Not registered user with ${req.body.password} password!`));
        }

        const accessToken = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET_STRING, {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );
        const refreshToken = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.REFRESH_TOKEN_SECRET_STRING
        );

        const savedTokenObj = await authHandlerService.saveToken({ refreshToken });

        res.status(200);
        res.json({
            accessToken,
            refreshToken: savedTokenObj.refreshToken,
            id: user._id,
            name: user.lastName,
            role: user.role,
            movies: user.movies,
        });
    } catch (err) {
        console.log(err);
        logger.debug('Something went wrong on server side!');
        return next(new createError.InternalServerError('Something went wrong on server side!'));
    }
};

// Refresh user-token
exports.refresh = async(req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            logger.debug('Unauthorized request!');
            return next(new createError.Unauthorized('Unauthorized request!'));
        }

        const savedTokenObj = await authHandlerService.getToken(token);
        if (!savedTokenObj) {
            logger.debug('Forbidden request!');
            return next(new createError.Forbidden('Forbidden request!'));
        }
        const { refreshToken } = savedTokenObj;

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_STRING, (err, user) => {
            if (err) {
                logger.debug('Forbidden request!');
                return next(new createError.Forbidden('Forbidden request!'));
            }

            const accessToken = jwt.sign({
                    username: user.username,
                    role: user.role,
                },
                process.env.ACCESS_TOKEN_SECRET_STRING, {
                    expiresIn: process.env.TOKEN_EXPIRY,
                }
            );

            res.status(200);
            res.json({ accessToken });
        });
    } catch (error) {
        logger.debug('Something went wrong on server side!');
        return next(new createError.InternalServerError('Something went wrong on server side!'));
    }
};

// Logout user
exports.logout = async(req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            logger.debug('Unauthorized request!');
            return next(new createError.Unauthorized('Unauthorized request!'));
        }

        const savedTokenObj = await authHandlerService.getToken(token);
        if (!savedTokenObj) {
            logger.debug('Forbidden request!');
            return next(new createError.Forbidden('Forbidden request!'));
        }
        const { refreshToken } = savedTokenObj;
        await authHandlerService.removeToken(refreshToken);

        res.status(200).json({});
    } catch (err) {
        logger.debug('Something went wrong on server side! Logout has failed!');
        return next(
            new createError.InternalServerError('Something went wrong on server side! Logout has failed!')
        );
    }
};
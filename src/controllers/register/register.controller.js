const createError = require('http-errors');
const logger = require('../../logger/logger');
const registerService = require('./register.service');

exports.register = async(req, res, next) => {
    try {
        if (!req.body['firstName'] ||
            !req.body['lastName'] ||
            !req.body['birthYear'] ||
            !req.body['gender'] ||
            !req.body['email'] ||
            !req.body['password']
        ) {
            logger.debug(`Invalid request body: ${JSON.stringify(req.body)}! Validation failed at client!`);
            return next(
                new createError.BadRequest(
                    `Invalid request body: ${JSON.stringify(req.body)}! Validation failed at client!`
                )
            );
        } else {
            const foundUser = await registerService.findOneByEmail(req.body['email']);
            if (!foundUser) {
                const userData = ({ firstName, lastName, birthYear, gender, email, password, movies } = req.body);
                userData.role = 'user';

                const savedUser = await registerService.saveUser(userData);
                res.status(201);
                res.json({ firstName: savedUser.firstName, lastName: savedUser.lastName, email: savedUser.email });
            } else {
                logger.debug(`A User already registered with email: ${req.body.email}!`);
                return next(
                    new createError.BadRequest(`A user already exists with ${req.body.email} e-mail address!`)
                );
            }
        }
    } catch (err) {
        logger.debug('Something went wrong on server side!');
        return next(new createError.InternalServerError('Something went wrong on server side!'));
    }
};
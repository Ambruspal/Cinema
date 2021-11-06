const createError = require('http-errors');
const logger = require('../../logger/logger');
const directorService = require('./director.service');

exports.getDirectorByName = async(req, res, next) => {
    try {
        const name = req.params.name;
        if (!name) {
            logger.debug('Not existing or invalid parameter in the path!');
            return next(new createError.BadRequest('Not existing or invalid parameter in the path!'));
        }
        const foundDirector = await directorService.getDirector(name);
        if (!foundDirector) {
            logger.debug(`No director found with name: ${name}!`);
            return next(new createError.NotFound(`No director found with the name: ${name}!`));
        } else {
            res.status(200).json(foundDirector);
        }
    } catch (err) {
        logger.debug('Something went wrong on server side!');
        return next(new createError.InternalServerError('Something went wrong on server side!'));
    }
};
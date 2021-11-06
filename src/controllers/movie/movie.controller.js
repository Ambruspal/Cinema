const createError = require('http-errors');
const logger = require('../../logger/logger');
const movieService = require('./movie.service');

exports.getMoviesByAttributeAndValue = async(req, res, next) => {
    try {
        const attribute = req.params.attribute;
        const value = req.params.value;

        if (!attribute || !value) {
            logger.debug('Not existing or invalid parameters in the path!');
            return next(new createError.BadRequest('Not existing or invalid parameters in the path!'));
        }

        const chosenMovies = await movieService.getSpecificMovies(attribute, value);

        if (chosenMovies.length === 0) {
            logger.debug(`NO movie(s) found with ${attribute} = ${value}!`);
            return next(new createError.NotFound(`NO movie(s) found with ${attribute} = ${value}!`));
        } else {
            res.status(200).json(chosenMovies);
        }
    } catch (err) {
        logger.debug('Something went wrong on server side!');
        return next(new createError.InternalServerError('Something went wrong on server side!'));
    }
};

exports.getAllMovies = async(req, res, next) => {
    try {
        const movieList = await movieService.getAll();
        if (movieList.length === 0) {
            logger.debug('NO movie(s) found!');
            return next(new createError.NotFound('NO movie(s) found!'));
        }
        res.status(200).json(movieList);
    } catch (err) {
        logger.debug('Something went wrong on server side!');
        return next(new createError.InternalServerError('Something went wrong on server side!'));
    }
};
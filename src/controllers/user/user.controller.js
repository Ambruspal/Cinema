const createError = require('http-errors');
const logger = require('../../logger/logger');
const userService = require('./user.service');

// Upgrade user's movies list
exports.updateUserMovies = async(req, res, next) => {
    const userId = req.params.userId;
    const movieId = req.params.movieId;

    if (!userId || !movieId) {
        logger.debug('Not existing parameters in the path!');
        return next(new createError.BadRequest('Not existing parameters in the path!'));
    }

    try {
        let user = await userService.findUserById(userId);

        if (!user.movies.includes(movieId)) {
            user.movies.push(movieId);
            await userService.updateUser(user);
        }
        user = await userService.findUserWithMovies(userId);

        res.status(201);
        res.json({ id: user._id, name: user.lastName, role: user.role, movies: user.movies });
    } catch (err) {
        logger.debug(
            `User is not found in database with id: ${userId} or something else went wrong on server side!`
        );
        return next(
            new createError.NotFound(
                `User is not found in database with id: ${userId} or something else went wrong on server side!`
            )
        );
    }
};
const express = require('express');
const movieController = require('./movie.controller');

const router = express.Router();

router.get('/', async(req, res, next) => {
    await movieController.getAllMovies(req, res, next);
});

router.get('/:attribute/:value', async(req, res, next) => {
    await movieController.getMoviesByAttributeAndValue(req, res, next);
});

module.exports = Object.freeze(router);
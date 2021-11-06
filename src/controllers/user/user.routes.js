const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.put('/:userId/:movieId', async(req, res, next) => {
    await userController.updateUserMovies(req, res, next);
});

module.exports = Object.freeze(router);
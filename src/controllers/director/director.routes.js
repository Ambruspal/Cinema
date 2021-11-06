const express = require('express');
const directorController = require('./director.controller');

const router = express.Router();

router.get('/:name', async(req, res, next) => {
    await directorController.getDirectorByName(req, res, next);
});

module.exports = Object.freeze(router);
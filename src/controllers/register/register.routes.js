const express = require('express');
const registerController = require('./register.controller');

const router = express.Router();

router.post('/', async(req, res, next) => {
    await registerController.register(req, res, next);
});

module.exports = Object.freeze(router);
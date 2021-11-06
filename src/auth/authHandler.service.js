const User = require('../models/user.model');
const Token = require('../models/token.model');
const bcryptjs = require('bcryptjs');
const logger = require('../logger/logger');
const createError = require('http-errors');

exports.getToken = token => Token.findOne({ refreshToken: token });

exports.removeToken = token => Token.findOneAndRemove({ refreshToken: token });

exports.findOneByEmailAndPassword = async(email, password, next) => {
    const user = await User.findOne({ email: email }).populate('movies');
    if (!user) {
        logger.error(`Not registered user with ${email} email address!`);
        return next(new createError.NotFound(`Not registered user with ${email} email address!`));
    }
    const isUserValid = await bcryptjs.compare(password, user.password);
    if (isUserValid) {
        return user;
    } else {
        return null;
    }
};

exports.saveToken = tokenData => {
    const newToken = new Token(tokenData);
    return newToken.save();
};
const authHandlerService = jest.mock('./authHandler.service.js');
const logger = require('../../logger/logger');
const createError = require('http-errors');
const bcryptjs = require('bcryptjs');

let mockData;
let mockTokenData;

authHandlerService.getToken = jest.fn(token =>
    Promise.resolve(mockTokenData.find(tokenObj => tokenObj.refreshToken === token))
);

authHandlerService.removeToken = jest.fn(token => {
    const tokenIndex = mockTokenData.findIndex(currentTokenObj => currentTokenObj.refreshToken === token);
    return Promise.resolve(mockTokenData.splice(tokenIndex, 1));
});

authHandlerService.findOneByEmailAndPassword = jest.fn(async(email, password, next) => {
    const user = mockData.find(user => user.email === email);
    if (!user) {
        logger.error(`Not registered user with ${email} email address!`);
        return next(new createError.NotFound(`Not registered user with ${email} email address!`));
    }

    const isUserValid = await bcryptjs.compare(password, user.password);
    if (isUserValid) {
        return Promise.resolve(user);
    } else {
        return Promise.resolve(null);
    }
});

authHandlerService.saveToken = jest.fn(tokenData => {
    mockTokenData.push(tokenData);
    return Promise.resolve(tokenData);
});

authHandlerService.__setMockData = data => (mockData = data);
authHandlerService.__setMockTokenData = tokenData => (mockTokenData = tokenData);

module.exports = Object.freeze(authHandlerService);
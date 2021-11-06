const authHandlerService = require('./authHandler.service');
const authHandler = require('./authHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const bcryptjs = require('bcryptjs');
const createError = require('http-errors');

jest.mock('./authHandler.service.js');

describe('authHandler tests', () => {
    const mockData = [{
            _id: 1,
            firstName: 'Alfa',
            lastName: 'Géza',
            birthYear: 1955,
            gender: 'male',
            role: 'user',
            movies: [],
            email: 'geza@mail.com',
            password: 'dhdfghojgojig',
        },
        {
            _id: 2,
            firstName: 'Béta',
            lastName: 'Oláf',
            birthYear: 1942,
            gender: 'male',
            role: 'user',
            movies: [],
            email: 'olaf@mail.hu',
            password: '3654fgdfgsgg',
        },
        {
            _id: 3,
            firstName: 'Gamma',
            lastName: 'Helga',
            birthYear: 1997,
            gender: 'female',
            role: 'user',
            movies: [],
            email: 'helga@mail.io',
            password: 'gsfgfgojhghhfg',
        },
    ];

    const mockTokenData = [];
    let refreshToken;
    let accessToken;

    let response;
    let nextFunction;

    beforeEach(() => {
        mockData.forEach(user => {
            const hash = bcryptjs.hashSync(user.password, 10);
            user.password = hash;
        });

        const user = {
            firstName: 'Béta',
            lastName: 'Oláf',
            role: 'user',
        };

        accessToken = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET_STRING, {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );

        refreshToken = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.REFRESH_TOKEN_SECRET_STRING
        );
        mockTokenData.push({ refreshToken });

        authHandlerService.__setMockData(mockData);
        authHandlerService.__setMockTokenData(mockTokenData);
        response = mockResponse();
        nextFunction = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Test login with valid request body', () => {
        const emailInput = 'helga@mail.io';
        const passwordInput = 'gsfgfgojhghhfg';

        const request = mockRequest({
            body: {
                email: emailInput,
                password: passwordInput,
            },
        });
        let { email, password } = request.body;
        const user = mockData.find(user => user.email === email);

        const accessToken = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET_STRING, {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );
        const refreshToken = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.REFRESH_TOKEN_SECRET_STRING
        );

        const refreshTokenData = {
            refreshToken,
        };

        return authHandler.login(request, response, nextFunction).then(() => {
            expect(authHandlerService.findOneByEmailAndPassword).toBeCalledWith(email, password, nextFunction);
            expect(authHandlerService.saveToken).toBeCalledWith(refreshTokenData);
            expect(nextFunction).not.toBeCalled();
            expect(response.status).toBeCalledWith(200);
            expect(response.json).toBeCalledWith({
                accessToken,
                refreshToken,
                id: user._id,
                name: user.lastName,
                role: user.role,
                movies: user.movies,
            });
        });
    });

    test('Test login with invalid password in request body', () => {
        const emailInput = 'helga@mail.io';
        const passwordInput = 'wrongone';

        const request = mockRequest({
            body: {
                email: emailInput,
                password: passwordInput,
            },
        });

        const { email, password } = request.body;

        return authHandler.login(request, response, nextFunction).then(() => {
            expect(authHandlerService.findOneByEmailAndPassword).toBeCalledWith(email, password, nextFunction);
            expect(authHandlerService.saveToken).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.NotFound(`Not registered user with ${request.body.password} password!`)
            );
        });
    });

    test('Test login with invalid email address in request body', () => {
        const emailInput = 'wrong@mail.hu';
        const passwordInput = 'gsfgfgojhghhfg';

        const request = mockRequest({
            body: {
                email: emailInput,
                password: passwordInput,
            },
        });

        const { email, password } = request.body;

        return authHandler.login(request, response, nextFunction).then(() => {
            expect(authHandlerService.findOneByEmailAndPassword).toBeCalledWith(email, password, nextFunction);
            expect(authHandlerService.saveToken).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.NotFound(`Not registered user with ${email} email address!`)
            );
        });
    });

    test('Test login with no or falsy request body', () => {
        const request = mockRequest({});

        return authHandler.login(request, response, nextFunction).then(() => {
            expect(authHandlerService.findOneByEmailAndPassword).not.toBeCalled();
            expect(authHandlerService.saveToken).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.BadRequest(
                    `Invalid request body: ${JSON.stringify(request.body)}! Login validation failed at client!`
                )
            );
        });
    });

    test('Test refresh with valid request body', () => {
        const request = mockRequest({
            body: {
                token: refreshToken,
            },
        });
        const { token } = request.body;

        return authHandler.refresh(request, response, nextFunction).then(() => {
            expect(authHandlerService.getToken).toBeCalledWith(token);
            expect(nextFunction).not.toBeCalled();
            expect(response.status).toBeCalledWith(200);
            expect(response.json).toBeCalledWith({ accessToken });
        });
    });

    test('Test refresh with invalid request body', () => {
        const request = mockRequest({
            body: {
                token: 'whatever',
            },
        });
        const { token } = request.body;

        return authHandler.refresh(request, response, nextFunction).then(() => {
            expect(authHandlerService.getToken).toBeCalledWith(token);
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(new createError.Forbidden('Forbidden request!'));
        });
    });

    test('Test refresh with no or falsy request body', () => {
        const request = mockRequest({});

        return authHandler.refresh(request, response, nextFunction).then(() => {
            expect(authHandlerService.getToken).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(new createError.Unauthorized('Unauthorized request!'));
        });
    });

    test('Test logout with valid request body', () => {
        const request = mockRequest({
            body: {
                token: refreshToken,
            },
        });
        const { token } = request.body;

        return authHandler.logout(request, response, nextFunction).then(() => {
            expect(authHandlerService.getToken).toBeCalledWith(token);
            expect(authHandlerService.removeToken).toBeCalledWith(refreshToken);
            expect(nextFunction).not.toBeCalled();
            expect(response.status).toBeCalledWith(200);
            expect(response.json).toBeCalledWith({});
        });
    });

    test('Test logout with invalid request body', () => {
        const request = mockRequest({
            body: {
                token: 'whatever',
            },
        });
        const { token } = request.body;

        return authHandler.logout(request, response, nextFunction).then(() => {
            expect(authHandlerService.getToken).toBeCalledWith(token);
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(new createError.Forbidden('Forbidden request!'));
        });
    });

    test('Test logout with no or falsy request body', () => {
        const request = mockRequest({});

        return authHandler.logout(request, response, nextFunction).then(() => {
            expect(authHandlerService.getToken).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(new createError.Unauthorized('Unauthorized request!'));
        });
    });
});
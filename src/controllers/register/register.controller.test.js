const registerService = require('./register.service');
const registerController = require('./register.controller');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const createError = require('http-errors');

jest.mock('./register.service.js');

describe('registerController tests', () => {
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
            role: 'admin',
            movies: [],
            email: 'helga@mail.io',
            password: 'gsfgfgojhghhfg',
        },
    ];

    let response;
    let nextFunction;

    beforeEach(() => {
        registerService.__setMockData(mockData);
        response = mockResponse();
        nextFunction = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Test register with valid request body', () => {
        const request = mockRequest({
            body: {
                firstName: 'Delta',
                lastName: 'Kata',
                birthYear: 2005,
                gender: 'female',
                role: 'user',
                email: 'kata@mail.hu',
                password: '8dfögs79dsf7',
                movies: [],
            },
        });

        const userData = request.body;

        return registerController.register(request, response, nextFunction).then(() => {
            expect(registerService.findOneByEmail).toBeCalledWith(userData.email);
            expect(registerService.saveUser).toBeCalledWith(userData);
            expect(response.json).toBeCalledWith({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
            });
        });
    });

    test('Test register with invalid request body', () => {
        const request = mockRequest({
            body: {
                firstName: 'Alfa',
                lastName: 'Géza',
                birthYear: 1955,
                gender: 'male',
                role: 'user',
                movies: [],
                email: 'geza@mail.com',
                password: 'dhdfghojgojig',
            },
        });

        const userData = request.body;

        return registerController.register(request, response, nextFunction).then(() => {
            expect(registerService.findOneByEmail).toBeCalledWith(userData.email);
            expect(registerService.saveUser).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.BadRequest(`A user already exists with ${request.body.email} e-mail address!`)
            );
        });
    });

    test('Test register with missing request body or missing required request body part(s)', () => {
        const request = mockRequest({
            body: {
                firstName: 'Alfa',
                birthYear: 1955,
                role: 'user',
                movies: [],
                email: 'geza@mail.com',
            },
        });

        return registerController.register(request, response, nextFunction).then(() => {
            expect(registerService.findOneByEmail).not.toBeCalled();
            expect(registerService.saveUser).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.BadRequest(
                    `Invalid request body: ${JSON.stringify(request.body)}! Validation failed at client!`
                )
            );
        });
    });
});
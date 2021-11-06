const userService = require('./user.service');
const userController = require('./user.controller');
require('dotenv').config();
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const createError = require('http-errors');

jest.mock('./user.service.js');

describe('UserController tests', () => {
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
        userService.__setMockData(mockData);
        response = mockResponse();
        nextFunction = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Test updateUserMovies with valid request parameters', () => {
        const userId = Math.floor(Math.random() * mockData.length) + 1;
        const movieId = Math.floor(Math.random() * 759653) + 1;

        const request = mockRequest({
            params: {
                userId,
                movieId,
            },
        });

        const user = mockData.find(user => user._id === userId);

        return userController.updateUserMovies(request, response, nextFunction).then(() => {
            expect(userService.findUserById).toBeCalledWith(userId);
            expect(userService.updateUser).toBeCalledWith(user);
            expect(userService.findUserWithMovies).toBeCalledWith(userId);
            expect(nextFunction).not.toBeCalled();
            expect(response.status).toBeCalledWith(201);
            expect(response.json).toBeCalledWith({
                id: mockData[userId - 1]._id,
                name: mockData[userId - 1].lastName,
                role: mockData[userId - 1].role,
                movies: mockData[userId - 1].movies,
            });
        });
    });

    test('Test updateUserMovies with invalid request parameters', () => {
        const userId = 'invalid userId';
        const movieId = 'invalid movieId';

        const request = mockRequest({
            params: {
                userId,
                movieId,
            },
        });

        return userController.updateUserMovies(request, response, nextFunction).then(() => {
            expect(userService.findUserById).toBeCalledWith(userId);
            expect(userService.updateUser).not.toBeCalled();
            expect(userService.findUserWithMovies).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.NotFound(
                    `User is not found in database with id: ${userId} or something else went wrong on server side!`
                )
            );
        });
    });

    test('Test updateUserMovies with missing or falsy request parameters', () => {
        const request = mockRequest({});

        return userController.updateUserMovies(request, response, nextFunction).then(() => {
            expect(userService.findUserById).not.toBeCalled();
            expect(userService.updateUser).not.toBeCalled();
            expect(userService.findUserWithMovies).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(new createError.BadRequest('Not existing parameters in the path!'));
        });
    });
});
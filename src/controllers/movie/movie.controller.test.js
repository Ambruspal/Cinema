const movieService = require('./movie.service');
const movieController = require('./movie.controller');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const createError = require('http-errors');

jest.mock('./movie.service.js');

describe('MovieController tests', () => {
    const mockData = [{
            id: 1,
            imgUrl: 'httpUrl33',
            title: 'Csillagok között',
            category: 'Kaland',
            director: 'James Spinner',
            ageRating: 10,
            description: 'Kalandos utazás a végtelen univerzumban.',
            duration: 120,
        },
        {
            id: 2,
            imgUrl: 'httpUrl66',
            title: 'Bogyóka',
            category: 'Animációs',
            director: 'Kovács Zsanett',
            ageRating: 4,
            description: 'Gyermekes történet.',
            duration: 22,
        },
        {
            id: 3,
            imgUrl: 'httpUrl44',
            title: 'Star wars',
            category: 'Akció',
            director: 'George Lucas',
            ageRating: 12,
            description: 'Háború egy messzi-messzi galaxisban.',
            duration: 111,
        },
        {
            id: 4,
            imgUrl: 'httpUrl55',
            title: 'Fekete Péter',
            category: 'Animációs',
            director: 'Tóth Géza',
            ageRating: 6,
            description: 'Vicces mese meseországban.',
            duration: 47,
        },
    ];

    let response;
    let nextFunction;

    beforeEach(() => {
        movieService.__setMockData(mockData);
        response = mockResponse();
        nextFunction = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Test getMoviesByAttributeAndValue with valid request parameters', () => {
        const ATTRIBUTE = 'category';
        const VALUE = 'Animációs';
        const request = mockRequest({
            params: {
                attribute: ATTRIBUTE,
                value: VALUE,
            },
        });
        const chosenMovies = mockData.filter(movie => movie[ATTRIBUTE] === VALUE);
        return movieController.getMoviesByAttributeAndValue(request, response, nextFunction).then(() => {
            expect(movieService.getSpecificMovies).toBeCalledWith(ATTRIBUTE, VALUE);
            expect(nextFunction).not.toBeCalled();
            expect(response.status).toBeCalledWith(200);
            expect(response.json).toBeCalledWith(chosenMovies);
        });
    });

    test('Test getMoviesByAttributeAndValue with invalid request parameters', () => {
        const ATTRIBUTE = 'color';
        const VALUE = 'white';
        const request = mockRequest({
            params: {
                attribute: ATTRIBUTE,
                value: VALUE,
            },
        });

        return movieController.getMoviesByAttributeAndValue(request, response, nextFunction).then(() => {
            expect(movieService.getSpecificMovies).toBeCalledWith(ATTRIBUTE, VALUE);
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.NotFound(`NO movie(s) found with ${ATTRIBUTE} = ${VALUE}!`)
            );
        });
    });

    test('Test getMoviesByAttributeAndValue with no or falsy request parameters', () => {
        const request = mockRequest({});

        return movieController.getMoviesByAttributeAndValue(request, response, nextFunction).then(() => {
            expect(movieService.getSpecificMovies).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.BadRequest('Not existing or invalid parameters in the path!')
            );
        });
    });

    test('Test getAllMovies', () => {
        const request = mockRequest();
        return movieController.getAllMovies(request, response, nextFunction).then(() => {
            expect(movieService.getAll).toBeCalled();
            expect(nextFunction).not.toBeCalled();
            expect(response.status).toBeCalledWith(200);
            expect(response.json).toBeCalledWith(mockData);
        });
    });
});
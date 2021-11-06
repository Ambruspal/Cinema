const directorController = require('./director.controller');
const directorService = require('./director.service');

const createError = require('http-errors');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

jest.mock('./director.service.js');

describe('DirectorController tests', () => {
    const mockData = [{
            _id: '53gd455345gfdgdfg',
            movies: [{ mov1: 'first' }, { mov2: 'second' }, { mov3: 'third' }],
            imgUrl: 'httpUrl11',
            name: 'Steven Spielberg',
            birthYear: 1944,
            story: 'Steve rendezte E.T -t.',
        },
        {
            _id: '93h5qjljj5j35f',
            movies: [{ mov4: 'fourth' }, { mov5: 'fifth' }, { mov6: 'sixth' }],
            imgUrl: 'httpUrl22',
            name: 'James Cameron',
            birthYear: 1956,
            story: 'James rendezte a Titanikot.',
        },
        {
            _id: 'fsdf89f97fs9d7fs7f',
            movies: [{ mov7: 'seventh' }, { mov8: 'eighth' }, { mov9: 'ninth' }],
            imgUrl: 'httpUrl33',
            name: 'William Wyler',
            birthYear: 1912,
            story: 'William rendezte a Big country-t.',
        },
    ];

    let response;
    let nextFunction;

    beforeEach(() => {
        directorService.__setMockData(mockData);
        response = mockResponse();
        nextFunction = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Test getDirectorByName with valid request parameter', () => {
        const name = 'James Cameron';
        const request = mockRequest({
            params: {
                name: name,
            },
        });
        return directorController.getDirectorByName(request, response, nextFunction).then(() => {
            expect(directorService.getDirector).toBeCalledWith(name);
            expect(nextFunction).not.toBeCalled();
            expect(response.status).toBeCalledWith(200);
            expect(response.json).toBeCalledWith(mockData[1]);
        });
    });

    test('Test getDirectorByName with invalid request parameter', () => {
        const name = 'Kuala Laci';
        const request = mockRequest({
            params: {
                name: name,
            },
        });
        return directorController.getDirectorByName(request, response, nextFunction).then(() => {
            expect(directorService.getDirector).toBeCalledWith(name);
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.BadRequest(`No director found with the name: ${name}!`)
            );
        });
    });

    test('Test getDirectorByName with no or falsy request parameter', () => {
        const request = mockRequest({});

        return directorController.getDirectorByName(request, response, nextFunction).then(() => {
            expect(directorService.getDirector).not.toBeCalled();
            expect(response.status).not.toBeCalled();
            expect(response.json).not.toBeCalled();
            expect(nextFunction).toBeCalledWith(
                new createError.BadRequest('Not existing or invalid parameter in the path!')
            );
        });
    });
});
const directorService = jest.mock('./director.service.js');

let mockData;

directorService.getDirector = jest.fn(name =>
    Promise.resolve(mockData.find(director => director.name === name))
);

directorService.__setMockData = data => (mockData = data);

module.exports = Object.freeze(directorService);
const movieService = jest.mock('./movie.service.js');

let mockData;

movieService.getSpecificMovies = jest.fn((attribute, value) =>
    Promise.resolve(mockData.filter(movie => movie[attribute] === value))
);

movieService.getAll = jest.fn(() => Promise.resolve(mockData));

movieService.__setMockData = data => (mockData = data);

module.exports = Object.freeze(movieService);
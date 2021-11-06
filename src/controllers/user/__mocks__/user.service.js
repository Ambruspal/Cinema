const userService = jest.mock('./user.service.js');

let mockData;

userService.findUserById = jest.fn(id => Promise.resolve(mockData.find(user => user._id === id)));

userService.updateUser = jest.fn(userForUpdate => {
    const indexToReplace = mockData.findIndex(user => user._id === userForUpdate._id);
    mockData.splice(indexToReplace, 1, userForUpdate);
    return Promise.resolve();
});

userService.findUserWithMovies = jest.fn(userId =>
    Promise.resolve(mockData.find(user => user._id === userId))
);

userService.__setMockData = data => (mockData = data);

module.exports = Object.freeze(userService);
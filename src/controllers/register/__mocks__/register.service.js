const registerService = jest.mock('./register.service.js');

let mockData;

registerService.findOneByEmail = jest.fn(email =>
    Promise.resolve(mockData.find(user => user.email === email))
);

registerService.saveUser = jest.fn(userData => {
    mockData.push(userData);
    return Promise.resolve(userData);
});

registerService.__setMockData = data => (mockData = data);

module.exports = Object.freeze(registerService);
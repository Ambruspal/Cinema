const supertest = require('supertest');
const app = require('./server');
const Director = require('./models/director.model');
const Movie = require('./models/movie.model');
const User = require('./models/user.model');
const Token = require('./models/token.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

//------------------Director--------------------------------

describe('Director integration tests', () => {
    const insertData = [{
            movies: [],
            imgUrl: 'httpUrl11',
            name: 'Steven Spielberg',
            birthYear: 1944,
            story: 'Steve rendezte E.T -t.',
        },
        {
            movies: [],
            imgUrl: 'httpUrl22',
            name: 'James Cameron',
            birthYear: 1956,
            story: 'James rendezte a Titanikot.',
        },
        {
            movies: [],
            imgUrl: 'httpUrl33',
            name: 'William Wyler',
            birthYear: 1912,
            story: 'William rendezte a Big country-t.',
        },
    ];

    let user;
    let token;

    beforeEach(done => {
        if (!config.has('testDatabase')) {
            console.log('Test database configuration not found!');
            process.exit();
        }

        const { dbType, dbUser, dbPassword, dbHost } = config.get('testDatabase');

        mongoose.Promise = global.Promise;
        mongoose.set('useFindAndModify', false);
        mongoose
            .connect(`${dbType}${dbUser}${dbPassword}${dbHost}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log('Connection with mongodb has been established');
                done();
            })
            .catch(err => {
                console.log(err);
                process.exit();
            });

        const firstNameList = ['Simonyi', 'Mézga', 'Bajai', 'Kovács', 'Egerszegi'];
        const lastNameList = ['Petra', 'Pál', 'János', 'Zoltán', 'Béla'];

        user = {
            firstName: firstNameList[Math.floor(Math.random() * firstNameList.length)],
            lastName: lastNameList[Math.floor(Math.random() * lastNameList.length)],
            role: 'user',
        };

        token = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET_STRING, {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );
    });

    afterEach(done => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(() => done());
        });
    });

    test('Get /directors/:name with valid request parameter', () => {
        let chosenDirectorFromDb;
        return Director.insertMany(insertData)
            .then(savedList => {
                const nameList = savedList.map(director => director.name);
                const randomIndex = Math.floor(Math.random() * savedList.length);
                const chosenName = nameList[randomIndex];
                chosenDirectorFromDb = savedList.find(dbDirector => dbDirector.name === chosenName);
                return supertest(app)
                    .get(`/directors/${chosenName}`)
                    .set('authorization', `Bearer ${token}`)
                    .expect(200);
            })
            .then(response => {
                const director = response.body;
                expect(director._id).toBe(chosenDirectorFromDb._id.toString());
                expect(director.name).toBe(chosenDirectorFromDb.name);
                expect(director.birthYear).toBe(chosenDirectorFromDb.birthYear);
                expect(director.story).toBe(chosenDirectorFromDb.story);
                expect(director.imgUrl).toBe(chosenDirectorFromDb.imgUrl);
            });
    });

    test('Get /directors/:name with valid request parameter but missing token in headers', () => {
        return Director.insertMany(insertData)
            .then(savedList => {
                const nameList = savedList.map(director => director.name);
                const randomIndex = Math.floor(Math.random() * savedList.length);
                const chosenName = nameList[randomIndex];
                return supertest(app).get(`/directors/${chosenName}`).expect(401);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe('Unauthorized request!');
            });
    });

    test('Get /directors/:name with invalid request parameter', () => {
        let invalidName;
        return Director.insertMany(insertData)
            .then(() => {
                invalidName = 'Mézga Géza';
                return supertest(app)
                    .get(`/directors/${invalidName}`)
                    .set('authorization', `Bearer ${token}`)
                    .expect(404);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe(`No director found with the name: ${invalidName}!`);
            });
    });
});

//------------------Movie-----------------------------------

describe('Movie integration tests', () => {
    const insertData = [{
            imgUrl: 'httpUrl33',
            title: 'Csillagok között',
            category: 'Kaland',
            director: 'James Spinner',
            ageRating: 10,
            description: 'Kalandos utazás a végtelen univerzumban.',
            duration: 120,
        },
        {
            imgUrl: 'httpUrl66',
            title: 'Bogyóka',
            category: 'Animációs',
            director: 'Kovács Zsanett',
            ageRating: 4,
            description: 'Gyermekes történet.',
            duration: 22,
        },
        {
            imgUrl: 'httpUrl44',
            title: 'Star wars',
            category: 'Akció',
            director: 'George Lucas',
            ageRating: 12,
            description: 'Háború egy messzi-messzi galaxisban.',
            duration: 111,
        },
        {
            imgUrl: 'httpUrl55',
            title: 'Fekete Péter',
            category: 'Animációs',
            director: 'Tóth Géza',
            ageRating: 6,
            description: 'Vicces mese meseországban.',
            duration: 47,
        },
        {
            imgUrl: 'httpUrl66',
            title: 'Pinokkió',
            category: 'Kaland',
            director: 'Albert Hans',
            ageRating: 5,
            description: 'Egy fabábú viszontagságai.',
            duration: 51,
        },
    ];

    let user;
    let token;

    beforeEach(done => {
        if (!config.has('testDatabase')) {
            console.log('Test database configuration not found!');
            process.exit();
        }

        const { dbType, dbUser, dbPassword, dbHost } = config.get('testDatabase');

        mongoose.Promise = global.Promise;
        mongoose.set('useFindAndModify', false);
        mongoose
            .connect(`${dbType}${dbUser}${dbPassword}${dbHost}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log('Connection with mongodb has been established');
                done();
            })
            .catch(err => {
                console.log(err);
                process.exit();
            });

        const firstNameList = ['Simonyi', 'Mézga', 'Bajai', 'Kovács', 'Egerszegi'];
        const lastNameList = ['Petra', 'Pál', 'János', 'Zoltán', 'Béla'];

        user = {
            firstName: firstNameList[Math.floor(Math.random() * firstNameList.length)],
            lastName: lastNameList[Math.floor(Math.random() * lastNameList.length)],
            role: 'user',
        };

        token = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET_STRING, {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );
    });

    afterEach(done => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(() => done());
        });
    });

    test('GET /movies/:attribute/:value with valid request parameters', () => {
        return Movie.insertMany(insertData).then(() => {
            const attribute = 'category';
            const value = 'Animációs';
            return supertest(app)
                .get(`/movies/${attribute}/${value}`)
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .then(response => {
                    const movieList = response.body;
                    expect(Array.isArray(movieList)).toBeTruthy();
                    movieList.forEach(movie => {
                        expect(movie[attribute]).toBe(value);
                    });
                });
        });
    });

    test('GET /movies/:attribute/:value with valid request parameters but missing token in headers', () => {
        return Movie.insertMany(insertData).then(() => {
            const attribute = 'category';
            const value = 'Animációs';
            return supertest(app)
                .get(`/movies/${attribute}/${value}`)
                .expect(401)
                .then(response => {
                    const respBody = response.body;
                    expect(respBody).toBe('Unauthorized request!');
                });
        });
    });

    test('GET /movies/:attribute/:value with valid request parameters but fake token in headers', () => {
        return Movie.insertMany(insertData).then(() => {
            const attribute = 'category';
            const value = 'Animációs';
            return supertest(app)
                .get(`/movies/${attribute}/${value}`)
                .set('authorization', 'Bearer k4a5m67u98t3o4ke465n')
                .expect(403)
                .then(response => {
                    const respBody = response.body;
                    expect(respBody).toBe('Forbidden request!');
                });
        });
    });

    test('GET /movies/:attribute/:value with invalid request parameters', () => {
        return Movie.insertMany(insertData).then(() => {
            const attribute = 'chocolate';
            const value = 'City';
            return supertest(app)
                .get(`/movies/${attribute}/${value}`)
                .set('authorization', `Bearer ${token}`)
                .expect(404)
                .then(response => {
                    const respBody = response.body;
                    expect(respBody).toBe(`NO movie(s) found with ${attribute} = ${value}!`);
                });
        });
    });

    test('GET /movies', () => {
        let savedMovies;
        return Movie.insertMany(insertData)
            .then(savedList => {
                savedMovies = savedList;
                return supertest(app).get('/movies').set('authorization', `Bearer ${token}`).expect(200);
            })
            .then(response => {
                const movieList = response.body;
                expect(Array.isArray(movieList)).toBeTruthy();
                movieList.forEach((movie, index) => {
                    expect(movie._id).toBe(savedMovies[index]._id.toString());
                    expect(movie.title).toBe(savedMovies[index].title);
                    expect(movie.ageRating).toBe(savedMovies[index].ageRating);
                    expect(movie.duration).toBe(savedMovies[index].duration);
                    expect(movie.director).toBe(savedMovies[index].director);
                    expect(movie.imgUrl).toBe(savedMovies[index].imgUrl);
                    expect(movie.description).toBe(savedMovies[index].description);
                });
            });
    });
});

//------------------User------------------------------------

describe('Register, authHandler.login and user integration tests', () => {
    const insertData = [{
            firstName: 'Alfa',
            lastName: 'Géza',
            birthYear: 1955,
            gender: 'male',
            role: 'user',
            movies: [],
            email: 'geza@mail.com',
            password: 'dhdfgho555jgojig',
        },
        {
            firstName: 'Béta',
            lastName: 'Oláf',
            birthYear: 1942,
            gender: 'male',
            role: 'admin',
            movies: [],
            email: 'olaf@mail.hu',
            password: '3654fgdfgsgg',
        },
        {
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

    let user;
    let token;

    beforeEach(done => {
        if (!config.has('testDatabase')) {
            console.log('Test database configuration not found!');
            process.exit();
        }

        const { dbType, dbUser, dbPassword, dbHost } = config.get('testDatabase');

        mongoose.Promise = global.Promise;
        mongoose.set('useFindAndModify', false);
        mongoose
            .connect(`${dbType}${dbUser}${dbPassword}${dbHost}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => done())
            .catch(err => {
                console.log(err);
                process.exit();
            });

        const firstNameList = ['Simonyi', 'Mézga', 'Bajai', 'Kovács', 'Egerszegi'];
        const lastNameList = ['Petra', 'Pál', 'János', 'Zoltán', 'Béla'];

        user = {
            firstName: firstNameList[Math.floor(Math.random() * firstNameList.length)],
            lastName: lastNameList[Math.floor(Math.random() * lastNameList.length)],
            role: 'user',
        };

        token = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET_STRING, {
                expiresIn: process.env.TOKEN_EXPIRY,
            }
        );
    });

    afterEach(done => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(() => done());
        });
    });

    test('POST /register with valid request body', () => {
        const userData = {
            firstName: 'Omega',
            lastName: 'Árpád',
            birthYear: 1987,
            gender: 'male',
            role: 'user',
            email: 'arpad@mail.com',
            password: 'dfsfsó77788',
            movies: [],
        };
        let savedUserList;
        return User.insertMany(insertData)
            .then(savedList => {
                savedUserList = savedList;
                savedUserList.push(userData);
                return supertest(app).post('/register').send(userData).expect(201);
            })
            .then(response => {
                const savedUser = response.body;
                expect(savedUser.firstName).toBe(savedUserList[savedUserList.length - 1].firstName);
                expect(savedUser.lastName).toBe(savedUserList[savedUserList.length - 1].lastName);
                expect(savedUser.email).toBe(savedUserList[savedUserList.length - 1].email);
            });
    });

    test('POST /register with missing request body or missing request body part(s)', () => {
        const userData = {
            lastName: 'Árpád',
            gender: 'male',
            email: 'arpad@mail.com',
            movies: [],
        };

        return User.insertMany(insertData)
            .then(() => {
                return supertest(app).post('/register').send(userData).expect(400);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe(
                    `Invalid request body: ${JSON.stringify(userData)}! Validation failed at client!`
                );
            });
    });

    test('POST /register with valid request body but with already registered email address', () => {
        const userData = {
            firstName: 'Omega',
            lastName: 'Árpád',
            birthYear: 1987,
            gender: 'male',
            role: 'user',
            email: 'helga@mail.io',
            password: 'dfsfsó77788',
            movies: [],
        };

        return User.insertMany(insertData)
            .then(() => {
                return supertest(app).post('/register').send(userData).expect(400);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe(`A user already exists with ${userData.email} e-mail address!`);
            });
    });

    test('POST /login with valid request body', () => {
        const loginData = {
            email: 'geza@mail.com',
            password: 'dhdfgho555jgojig',
        };
        let savedUserList;
        insertData.forEach(user => {
            const hash = bcryptjs.hashSync(user.password, 10);
            user.password = hash;
        });
        return User.insertMany(insertData)
            .then(savedList => {
                savedUserList = savedList;
                return supertest(app).post('/login').send(loginData).expect(200);
            })
            .then(response => {
                const responseUser = response.body;
                expect(responseUser.accessToken).toBeTruthy();
                expect(responseUser.refreshToken).toBeTruthy();
                expect(typeof responseUser.accessToken).toBe('string');
                expect(typeof responseUser.refreshToken).toBe('string');
                expect(responseUser.id).toBe(savedUserList[0]._id.toString());
                expect(responseUser.name).toBe(savedUserList[0].lastName);
                expect(responseUser.movies).toEqual(savedUserList[0].movies.toObject());
                expect(responseUser.role).toBe(savedUserList[0].role);
            });
    });

    test('POST /login with missing request body', () => {
        insertData.forEach(user => {
            const hash = bcryptjs.hashSync(user.password, 10);
            user.password = hash;
        });

        return User.insertMany(insertData)
            .then(() => {
                return supertest(app).post('/login').send({}).expect(400);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe(
                    `Invalid request body: ${JSON.stringify({})}! Login validation failed at client!`
                );
            });
    });

    test('PUT /users/:userId/:movieId with valid request parameters', () => {
        const movieToSave = {
            title: 'A függetlenség napja',
            imgUrl: 'http://localhost:3000/images/A-f%C3%BCggetlens%C3%A9g-napja.jpg',
            category: 'Akció',
            director: 'Roland Emmerich',
            duration: 155,
            description: 'Egy földönkívüli faj támadja meg a földet. Az eseményt több szereplő szemszögéből kísérhetjük végig, míg végül az emberi kitartás, leleményesség és áldozatkészség meghozza az áhított győzelmet az emberiségnek.',
            ageRating: 14,
        };
        const movie = new Movie(movieToSave);

        let userId;
        let movieId;
        let savedUser;
        let savedMovie;

        return movie
            .save()
            .then(movie => {
                movieId = movie._id;
                savedMovie = movie;
                return User.insertMany(insertData);
            })
            .then(savedUserList => {
                savedUser = savedUserList[2];
                userId = savedUserList[2]._id;
                return supertest(app)
                    .put(`/users/${userId}/${movieId}`)
                    .set('authorization', `Bearer ${token}`)
                    .expect(201);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody.id).toBe(userId.toString());
                expect(respBody.id).toBe(savedUser._id.toString());
                expect(respBody.name).toBe(savedUser.lastName);
                expect(respBody.role).toBe(savedUser.role);
                expect(respBody.movies[0]._id).toBe(savedMovie._id.toString());
                expect(respBody.movies[0].ageRating).toBe(savedMovie.ageRating);
                expect(respBody.movies[0].category).toBe(savedMovie.category);
                expect(respBody.movies[0].description).toBe(savedMovie.description);
                expect(respBody.movies[0].director).toBe(savedMovie.director);
                expect(respBody.movies[0].duration).toBe(savedMovie.duration);
                expect(respBody.movies[0].imgUrl).toBe(savedMovie.imgUrl);
                expect(respBody.movies[0].title).toBe(savedMovie.title);
            });
    });

    test('PUT /users/:userId/:movieId with valid request parameters but missing token in headers', () => {
        const movieToSave = {
            title: 'A függetlenség napja',
            imgUrl: 'http://localhost:3000/images/A-f%C3%BCggetlens%C3%A9g-napja.jpg',
            category: 'Akció',
            director: 'Roland Emmerich',
            duration: 155,
            description: 'Egy földönkívüli faj támadja meg a földet. Az eseményt több szereplő szemszögéből kísérhetjük végig, míg végül az emberi kitartás, leleményesség és áldozatkészség meghozza az áhított győzelmet az emberiségnek.',
            ageRating: 14,
        };
        const movie = new Movie(movieToSave);

        let userId;
        let movieId;

        return movie
            .save()
            .then(movie => {
                movieId = movie._id;
                return User.insertMany(insertData);
            })
            .then(savedUserList => {
                userId = savedUserList[2]._id;
                return supertest(app).put(`/users/${userId}/${movieId}`).expect(401);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe('Unauthorized request!');
            });
    });

    test('PUT /users/:userId/:movieId with invalid userId parameter', () => {
        const movieToSave = {
            title: 'A függetlenség napja',
            imgUrl: 'http://localhost:3000/images/A-f%C3%BCggetlens%C3%A9g-napja.jpg',
            category: 'Akció',
            director: 'Roland Emmerich',
            duration: 155,
            description: 'Egy földönkívüli faj támadja meg a földet. Az eseményt több szereplő szemszögéből kísérhetjük végig, míg végül az emberi kitartás, leleményesség és áldozatkészség meghozza az áhított győzelmet az emberiségnek.',
            ageRating: 14,
        };
        const movie = new Movie(movieToSave);

        let userId = 'n4o5t6e9x98isting84us98erI8123di3nDb';
        let movieId;

        return movie
            .save()
            .then(movie => {
                movieId = movie._id;
                return User.insertMany(insertData);
            })
            .then(() => {
                return supertest(app)
                    .put(`/users/${userId}/${movieId}`)
                    .set('authorization', `Bearer ${token}`)
                    .expect(404);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe(
                    `User is not found in database with id: ${userId} or something else went wrong on server side!`
                );
            });
    });
});

describe('AuthHandler.refresh and authHandler.logout integration tests', () => {
    const insertData = [];

    let refreshToken;

    beforeEach(done => {
        if (!config.has('testDatabase')) {
            console.log('Test database configuration not found!');
            process.exit();
        }

        const { dbType, dbUser, dbPassword, dbHost } = config.get('testDatabase');

        mongoose.Promise = global.Promise;
        mongoose.set('useFindAndModify', false);
        mongoose
            .connect(`${dbType}${dbUser}${dbPassword}${dbHost}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => done())
            .catch(err => {
                console.log(err);
                process.exit();
            });

        const firstNameList = ['Simonyi', 'Mézga', 'Bajai', 'Kovács', 'Egerszegi'];
        const lastNameList = ['Petra', 'Pál', 'János', 'Zoltán', 'Béla'];

        const user = {
            firstName: firstNameList[Math.floor(Math.random() * firstNameList.length)],
            lastName: lastNameList[Math.floor(Math.random() * lastNameList.length)],
            role: 'user',
        };

        refreshToken = jwt.sign({
                username: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
            process.env.REFRESH_TOKEN_SECRET_STRING
        );
        insertData.push({ refreshToken });
    });

    afterEach(done => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(() => done());
        });
    });

    test('POST /refresh with valid request body', () => {
        return Token.insertMany(insertData)
            .then(() => {
                return supertest(app).post('/refresh').send({ token: refreshToken }).expect(200);
            })
            .then(response => {
                const respBody = response.body;
                expect(typeof respBody.accessToken).toBe('string');
                expect(respBody.accessToken).toBeTruthy();
            });
    });

    test('POST /refresh with invalid token in request body', () => {
        return Token.insertMany(insertData)
            .then(() => {
                return supertest(app).post('/refresh').send({ token: 'invalid refresh fake token' }).expect(403);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe('Forbidden request!');
            });
    });

    test('POST /refresh with missing token in request body', () => {
        return Token.insertMany(insertData)
            .then(() => {
                return supertest(app).post('/refresh').send({}).expect(401);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe('Unauthorized request!');
            });
    });

    test('POST /logout with valid request body', () => {
        return Token.insertMany(insertData)
            .then(() => {
                return supertest(app).post('/logout').send({ token: refreshToken }).expect(200);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toEqual({});
            });
    });

    test('POST /logout with invalid token in request body', () => {
        return Token.insertMany(insertData)
            .then(() => {
                return supertest(app).post('/logout').send({ token: 'invalid refresh fake token' }).expect(403);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe('Forbidden request!');
            });
    });

    test('POST /logout with missing token in request body', () => {
        return Token.insertMany(insertData)
            .then(() => {
                return supertest(app).post('/logout').send({}).expect(401);
            })
            .then(response => {
                const respBody = response.body;
                expect(respBody).toBe('Unauthorized request!');
            });
    });
});
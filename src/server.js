const express = require('express');
const app = express();

const cors = require('cors');

const logger = require('./logger/logger');
const morgan = require('morgan');

const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./doc/swagger.yaml');

const path = require('path');
const staticUrl = path.join(__dirname, '..', 'public', 'movie-database-project');

const authUser = require('./auth/authorization');

app.use(cors());

app.use(
    morgan(':method req/res to :url with code :status', {
        stream: logger.stream,
    })
);

app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => {
    logger.info(`${req.method} request has arrived to ${req.path} endpoint at ${new Date().toLocaleString()}`);
    next();
});

app.post('/login', require('./auth/authHandler').login);
app.post('/refresh', require('./auth/authHandler').refresh);
app.post('/logout', require('./auth/authHandler').logout);

app.use('/register', require('./controllers/register/register.routes'));
app.use('/users', authUser, require('./controllers/user/user.routes'));
app.use('/movies', authUser, require('./controllers/movie/movie.routes'));
app.use('/directors', authUser, require('./controllers/director/director.routes'));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', express.static(staticUrl));

app.all('*', (req, res) => {
    res.redirect('/');
});

app.use((err, req, res, next) => {
    logger.error(`Error occured: ${err.statusCode}, ${err.message}`);
    res.status(err.statusCode);
    res.json(err.message);
});

module.exports = Object.freeze(app);
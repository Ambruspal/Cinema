require('dotenv').config();
const config = require('config');
const port = process.env.PORT || 3000;
const logger = require('./logger/logger');

const app = require('./server');
const mongoose = require('mongoose');

if (!config.has('database')) {
    logger.error('Database configuration not found!');
    process.exit();
}
const { dbType, dbUser, dbPassword, dbHost } = config.get('database');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose
    .connect(`${dbType}${dbUser}${dbPassword}${dbHost}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        logger.debug('Connection with mongodb has been established');
    })
    .catch(err => {
        logger.error(err);
        process.exit();
    });

app.listen(port, () => {
    logger.debug(`Server is running on http://localhost:${port}`);
});
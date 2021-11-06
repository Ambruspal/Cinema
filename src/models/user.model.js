const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');
const bcryptjs = require('bcryptjs');
const logger = require('../logger/logger');
const createError = require('http-errors');

const UserSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthYear: { type: Number, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
}, {
    timestamps: true,
});

UserSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew) {
        const user = this;

        bcryptjs.hash(user.password, 10, (err, hash) => {
            if (err) {
                logger.error('Password hashing has failed!');
                return next(new createError.InternalServerError('Password hashing has failed!'));
            }

            user.password = hash;
            next();
        });
    } else next();
});

UserSchema.plugin(idValidator);

module.exports = mongoose.model('User', UserSchema, 'users');
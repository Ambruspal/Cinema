const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    refreshToken: { type: String, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Token', TokenSchema, 'tokens');
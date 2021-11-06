const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    imgUrl: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    director: { type: String, required: true },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
    ageRating: { type: Number, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Movie', MovieSchema, 'movies');
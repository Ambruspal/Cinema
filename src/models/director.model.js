const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const DirectorSchema = mongoose.Schema({
    imgUrl: { type: String, required: true },
    name: { type: String, required: true },
    birthYear: { type: Number, required: true },
    story: { type: String, required: true },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
}, {
    timestamps: true,
});

DirectorSchema.plugin(idValidator);

module.exports = mongoose.model('Director', DirectorSchema, 'directors');
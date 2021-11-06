const Movie = require('../../models/movie.model');

exports.getSpecificMovies = (attribute, value) =>
    Movie.find({
        [attribute]: value,
    });

exports.getAll = () => Movie.find();
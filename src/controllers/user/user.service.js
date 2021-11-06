const User = require('../../models/user.model');

exports.findUserById = id => User.findById(id);

exports.findUserWithMovies = id => User.findById(id).populate('movies');

exports.updateUser = user => user.save();
const Director = require('../../models/director.model');

exports.getDirector = name => Director.findOne({ name: name }).populate('movies');
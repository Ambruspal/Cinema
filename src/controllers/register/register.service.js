const User = require('../../models/user.model');

exports.findOneByEmail = email => User.findOne({ email: email });

exports.saveUser = userData => {
    const newUser = new User(userData);
    return newUser.save();
};
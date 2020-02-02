const mongoose = require('mongoose');
const {compareHash, genHash} = require('../common/bcrypt')

const userSchema = mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    username: {
        type: String
    },
    score: {
        type: Number,
        default: 0
    },
    created: {
        type: Number,
        default: Date.now()
    }
})

userSchema.statics.getByEmail = function getByEmail(email) {
    return User.findOne({'email': email});
}

userSchema.statics.getByUsername = function getByEmail(username) {
    return User.findOne({'username': username});
}

const User = mongoose.model('user', userSchema);

module.exports = User;
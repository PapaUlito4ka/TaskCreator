const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: Number,
    }
});

const userProfileSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
        maxLength: 256
    }
});

userSchema.methods.verifyPassword = function (rawPassword) {
    return bcrypt.compareSync(rawPassword, this.password);
};

userSchema.path('password').set(function (rawPassword) {
    let max = 15;
    let min = 10;
    this.salt = Math.floor(Math.random() * (max - min) + min);
    let hashPassword = bcrypt.hashSync(rawPassword, this.salt);
    return hashPassword;
});


userProfileSchema.methods.getFullName = function () {
    return this.lastname + ' ' + this.firstname;
};


const User = mongoose.model('User', userSchema);
const UserProfile = mongoose.model('UserProfile', userProfileSchema);


module.exports = {
    User: User,
    UserProfile: UserProfile
};
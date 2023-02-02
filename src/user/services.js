const { User, UserProfile } = require('./models');
const mongoose = require('mongoose');


module.exports.createUser = async function (body) {
    let user = null;
    return User.create({
        'email': body.email,
        'password': body.password
    })
        .then(_user => {
            user = _user;
            return UserProfile.create({
                'user': user,
                'firstname': body.firstname,
                'lastname': body.lastname
            })
        })
        .catch(err => {
            if (user) user.remove();
            throw err;
        });
};

module.exports.getUserProfile = async function (userSession) {
    let user = await UserProfile.findById(userSession._id);
    let userProfile = await UserProfile.findOne({ user: user });
    return {
        email: user.email,
        firstname: userProfile.firstname,
        lastname: userProfile.lastname
    };
};

module.exports.updateUserProfile = async function (userSession, body) {
    let user = await User.findById(userSession._id);
    let userProfile = await UserProfile.findOne({ user: user });
    let userFieldsToChange = {
        email: user.email,
    };
    let userProfileFieldsToChange = {
        firstname: userProfile.firstname,
        lastname: userProfile.lastname
    };

    for (key in body) {
        if (key in userFieldsToChange) {
            userFieldsToChange[key] = body[key];
        } else if (key in userProfileFieldsToChange) {
            userProfileFieldsToChange[key] = body[key];
        }
    }

    await user.update({ $set: userFieldsToChange });
    await userProfile.update({ $set: userProfileFieldsToChange });
};
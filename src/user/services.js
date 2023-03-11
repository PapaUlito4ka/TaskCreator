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
    let userProfile = await UserProfile.findOne({ user: userSession });

    let userProfileFieldsToChange = {
        firstname: body.firstname.trim(),
        lastname: body.lastname.trim(),
        description: body.description.trim()
    };

    return await userProfile.updateOne({ $set: userProfileFieldsToChange });
};

module.exports.profilePage = async function (userSession) {
    let userProfile = await UserProfile.findOne({ user: userSession });

    return {
        'user': userSession,
        'userProfile': userProfile,
        'userSession': userSession
    };
};

module.exports.userProfilePage = async function (userSession, userId) {
    let user = await User.findById(userId);
    let userProfile = await UserProfile.findOne({ user: user });

    return {
        'user': user,
        'userProfile': userProfile,
        'userSession': userSession
    };
};

module.exports.changeProfilePage = async function (userSession) {
    let userProfile = await UserProfile.findOne({ user: userSession });

    return {
        'user': userSession,
        'userProfile': userProfile,
        'userSession': userSession
    };
};
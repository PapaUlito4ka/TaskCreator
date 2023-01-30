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


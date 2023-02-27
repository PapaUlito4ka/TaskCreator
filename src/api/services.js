const { User, UserProfile } = require("../user/models");


module.exports.getAllUsers = async function (exceptUserId) {
    let users = await User.find({ _id: { $ne: exceptUserId } });

    return users.map(user => user.email);
};


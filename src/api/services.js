const { User, UserProfile } = require("../user/models");
const { Project } = require('../project/models');
const { Team } = require('../team/models');


module.exports.getAllUsers = async function (exceptUserId) {
    let users = await User.find({ _id: { $ne: exceptUserId } });

    return users.map(user => user.email);
};

module.exports.getUserTeams = async function (userId) {
    let user = await User.findById(userId);
    let teams = await Team.find({ founder: user });

    return teams.map(team => {
        return { 'name': team.name, '_id': team._id };
    });
};

module.exports.getTeamMembers = async function (teamId) {
    let team = await Team.findById(teamId).populate('members');
    
    for (let member of team.members) {
        member.userProfile = await UserProfile.findOne({ user: member });
    }

    return team.members.map(member => {
        return {
            '_id': member._id,
            'fullname': member.userProfile.getFullName()
        }
    });
};

const { User } = require('../user/models.js');
const { Team } = require('./models.js');


module.exports.getTeams = async function (userSession) {
    let user = await User.findById(userSession._id);

    return await Team.find({ members: user._id });
};

module.exports.getFoundedTeams = async function (userSession) {
    let user = await User.findById(userSession._id);

    return await Team.find({ founder: user });
};

module.exports.createTeam = async function (userSession, body) {
    let user = await User.findById(userSession._id);

    await Team.create({
        name: body.name,
        founder: user,
        members: body.members,
    });
};

module.exports.updateTeam = async function (userSession, teamId, body) {
    let user = await User.findById(userSession._id);
    let team = await Team.findById(teamId);

    if (team.founder !== user) {
        throw new Error(`You don't have access to modify this team`);
    }

    let fieldsToChange = {
        name: team.name,
        members: team.members,
    };

    for (key in body) {
        if (key in fieldsToChange) {
            fieldsToChange[key] = body[key];
        }
    }

    await team.update({ $set: fieldsToChange });
};

module.exports.getTeam = async function (userSession, teamId) {
    let user = await User.findById(userSession._id);
    let team = await Team.findById(teamId);

    if (!(user in team.members) || team.founder !== user) {
        throw new Error(`You don't have access to view this team`);
    }

    return team;
};

module.exports.deleteTeam = async function (userSession, teamId) {
    let user = await User.findById(userSession._id);
    let team = await Team.findById(teamId);

    if (team.founder !== user) {
        throw new Error(`You don't have access to delete this team`);
    }

    await team.delete();
};

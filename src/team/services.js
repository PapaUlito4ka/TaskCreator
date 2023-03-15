const { Project } = require('../project/models.js');
const { Task } = require('../task/models.js');
const { User, UserProfile } = require('../user/models.js');
const { Team } = require('./models.js');
const { Comment } = require('../comment/models.js');


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
    let members = body.members.trim().split(' ');

    await Team.create({
        name: body.name,
        founder: user,
        members: members,
    });
};

module.exports.updateTeam = async function (userSession, teamId, body) {
    let team = await Team.findById(teamId);

    if (!team.founder.equals(userSession._id)) {
        throw new Error(`You don't have access to modify this team`);
    }

    let fieldsToChange = {
        name: body.name.trim(),
        members: body.members.trim().split(' '),
    };

    return await team.updateOne({ $set: fieldsToChange });
};

module.exports.getTeam = async function (userSession, teamId) {
    let user = await User.findById(userSession._id);
    let team = await Team.findById(teamId);

    if (!(team.members.find(member => member.equals(user._id)) || team.founder.equals(user._id))) {
        throw new Error(`You don't have access to view this team`);
    }

    return team;
};

module.exports.deleteTeam = async function (userSession, teamId) {
    let team = await Team.findById(teamId);

    if (!team.founder.equals(userSession._id)) {
        throw new Error(`You don't have access to delete this team`);
    }

    let projects = await Project.find({ team: team });
    let tasks = await Task.find({ project: { $in: projects } });
    await Comment.find({ task: { $in: tasks } }).deleteMany();
    await Task.deleteMany({ _id: { $in: tasks.map(task => task._id) } });
    await Project.deleteMany({ _id: { $in: projects.map(proj => proj._id) } });
    return await team.deleteOne();
};

module.exports.deleteTeamMember = async function (userSession, teamId, memberId) {
    let team = await Team.findById(teamId);

    if (!team.founder.equals(userSession._id)) {
        throw new Error(`You don't have access to delete member from team`);
    }

    let member = await User.findById(memberId);
    team.members = team.members.filter(user => !user.equals(member._id));
    return await team.save();
};

module.exports.teamsPage = async function (userSession) {
    let teams = await this.getTeams(userSession);
    let foundedTeams = await this.getFoundedTeams(userSession);
    for (let team of teams) {
        team.founderProfile = await UserProfile.findOne({ user: team.founder });
    }

    return {
        'teams': teams,
        'foundedTeams': foundedTeams
    };
};

module.exports.teamPage = async function (userSession, teamId) {
    let team = await this.getTeam(userSession, teamId).then(team => team.populate('members'));
    let founderProfile = await UserProfile.findOne({ user: team.founder });

    for (let member of team.members) {
        member.userProfile = await UserProfile.findOne({ user: member._id });
    }

    return {
        'team': team,
        'founderProfile': founderProfile,
        'userSession': userSession
    };
};

module.exports.updateTeamPage = async function (userSession, teamId) {
    let team = await (await this.getTeam(userSession, teamId)).populate('members');
    team.membersBlob = [];
    for (let member of team.members) {
        team.membersBlob.push(await UserProfile.findOne({ user: member }));
    }
    team.membersBlob = team.membersBlob.map(p => p.getFullName()).join(', ');
    team.memberIds = team.members.map(p => p._id).join(' ');

    return {
        'userSession': userSession,
        'team': team
    };
};
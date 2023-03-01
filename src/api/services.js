const { User, UserProfile } = require("../user/models");
const { Project } = require('../project/models');
const { Team } = require('../team/models');


module.exports.getAllUsers = async function (exceptUserId) {
    let users = await User.find({ _id: { $ne: exceptUserId } });

    return users.map(user => {
        return { 'email': user.email, '_id': user._id };
    });
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

module.exports.getUserProjects = async function (userId) {
    let user = await User.findById(userId);
    let projects = await Project.find({ $or: [{ creator: user }, { workers: user._id }] });

    return projects.map(project => {
        return { 'name': project.name, '_id': project._id };
    });
};

module.exports.getProjectWorkers = async function (projectId) {
    let project = await Project.findById(projectId).populate(['workers', 'creator']);

    project.workers.push(project.creator)
    for (let worker of project.workers) {
        worker.userProfile = await UserProfile.findOne({ user: worker });
    }

    return project.workers.map(worker => {
        return {
            '_id': worker._id,
            'fullname': worker.userProfile.getFullName()
        }
    });
};
const { User } = require('../user/models.js');
const { Project } = require('./models.js');


module.exports.getProjects = async function (userSession) {
    let user = await User.findById(userSession._id);

    return await Project.find({ workers: user._id });
};

module.exports.getLeadedProjects = async function (userSession) {
    let user = await User.findById(userSession._id);

    return await Project.find({ creator: user });
};

module.exports.createProject = async function (userSession, body) {
    let user = await User.findById(userSession._id);

    await Project.create({
        name: body.name,
        description: body.description,
        team: body.team,
        creator: user,
        workers: body.workers,
        period: {
            from: body.from,
            to: body.to
        }
    });
};

module.exports.updateProject = async function (userSession, projectId, body) {
    let user = await User.findById(userSession._id);
    let project = await Project.findById(projectId);

    if (project.creator !== user) {
        throw new Error(`You don't have access to modify this project`);
    }

    let fieldsToChange = {
        name: project.name,
        description: project.description,
        team: project.team,
        workers: project.workers,
        period: {
            from: project.period.from,
            to: project.period.to
        },
    };

    for (key in body) {
        if (key in fieldsToChange) {
            fieldsToChange[key] = body[key];
        }
    }

    await project.update({ $set: fieldsToChange });
};

module.exports.getProject = async function (userSession, projectId) {
    let user = await User.findById(userSession._id);
    let project = await Project.findById(projectId);

    if (!(user in project.workers) || project.creator !== user) {
        throw new Error(`You don't have access to view this project`);
    }

    return project;
};

module.exports.deleteProject = async function (userSession, projectId) {
    let user = await User.findById(userSession._id);
    let project = await Project.findById(projectId);

    if (project.creator !== user) {
        throw new Error(`You don't have access to delete this project`);
    }

    await project.delete();
};

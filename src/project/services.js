const { Task } = require('../task/models.js');
const { User, UserProfile } = require('../user/models.js');
const { Project } = require('./models.js');

const UserService = require('../user/services');


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
    let periodFrom = new Date(body.from) || null;
    let periodTo = new Date(body.to);

    await Project.create({
        name: body.name,
        description: body.description,
        team: body.team,
        creator: user,
        workers: body.workers,
        period: {
            from: periodFrom,
            to: periodTo
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

    if (!(user in project.workers) && !project.creator.equals(user._id)) {
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


module.exports.projectsPage = async function (userSession) {
    let projects = await this.getProjects(userSession);
    let leadedProjects = await this.getLeadedProjects(userSession);

    return {
        'projects': projects,
        'leadedProjects': leadedProjects
    };
};

module.exports.projectPage = async function (userSession, projectId) {
    let project = await this.getProject(userSession, projectId)
        .then(project => project.populate('team'));
    let tasks = await Task.find({ project: project });
    for (let task of tasks) {
        task.userPro
    }
    let expiredTasks = tasks.filter(task => new Date() > task.period.to);
    let createdTasks = tasks.filter(task => task.status === 'created');
    let inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    let finishedTasks = tasks.filter(task => task.status === 'finished');
    let creatorProfile = await UserProfile.findOne({ user: project.creator });
    let workerProfiles = await UserProfile.find({ user: project.workers });

    return {
        'project': project,
        'expiredTasks': expiredTasks,
        'createdTasks': createdTasks,
        'inProgressTasks': inProgressTasks,
        'finishedTasks': finishedTasks,
        'creatorProfile': creatorProfile,
        'workerProfiles': workerProfiles
    };
};
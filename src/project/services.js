const { Task } = require('../task/models.js');
const { User, UserProfile } = require('../user/models.js');
const { Project } = require('./models.js');
const { Comment } = require('../comment/models');


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
    let periodFrom = new Date(body.from) || new Date();
    let periodTo = new Date(body.to);
    let workers = body.workers.trim().split(' ');

    await Project.create({
        name: body.name,
        description: body.description,
        team: body.team,
        creator: user,
        workers: workers,
        period: {
            from: periodFrom,
            to: periodTo
        }
    });
};

module.exports.updateProject = async function (userSession, projectId, body) {
    let project = await Project.findById(projectId);

    if (!project.creator.equals(userSession._id)) {
        throw new Error(`You don't have access to modify this project`);
    }

    let fieldsToChange = {
        name: body.name.trim(),
        description: body.description.trim(),
        team: body.team.trim(),
        workers: body.workers.trim().split(' '),
        period: {
            from: body.periodFrom,
            to: body.periodTo
        },
    };

    return await project.updateOne({ $set: fieldsToChange });
};

module.exports.getProject = async function (userSession, projectId) {
    let user = await User.findById(userSession._id);
    let project = await Project.findById(projectId);

    if (!(project.workers.find(worker => worker.equals(user._id)) || project.creator.equals(user._id))) {
        throw new Error(`You don't have access to view this project`);
    }

    return project;
};

module.exports.deleteProject = async function (userSession, projectId) {
    let project = await Project.findById(projectId);

    if (!project.creator.equals(userSession._id)) {
        throw new Error(`You don't have access to delete this project`);
    }

    let tasks = await Task.find({ project: project });
    await Comment.find({ task: { $in: tasks } }).deleteMany();
    await Task.deleteMany({ _id: { $in: tasks.map(task => task._id) } });
    return await project.deleteOne();
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
    let createdTasks = tasks.filter(task => task.status === 'created' && new Date() <= task.period.to);
    let inProgressTasks = tasks.filter(task => task.status === 'in-progress' && new Date() <= task.period.to);
    let finishedTasks = tasks.filter(task => task.status === 'done' && new Date() <= task.period.to);
    let creatorProfile = await UserProfile.findOne({ user: project.creator });
    let workerProfiles = await UserProfile.find({ user: project.workers });

    return {
        'project': project,
        'expiredTasks': expiredTasks,
        'createdTasks': createdTasks,
        'inProgressTasks': inProgressTasks,
        'finishedTasks': finishedTasks,
        'creatorProfile': creatorProfile,
        'workerProfiles': workerProfiles,
        'userSession': userSession
    };
};

module.exports.updateProjectPage = async function (userSession, projectId) {
    let project = await (await this.getProject(userSession, projectId)).populate(['team', 'workers']);
    project.teamBlob = project.team.name;
    project.workersBlob = [];
    for (let worker of project.workers) {
        project.workersBlob.push(await UserProfile.findOne({ user: worker }));
    }
    project.workersBlob = project.workersBlob.map(p => p.getFullName()).join(', ');
    project.workerIds = project.workers.map(p => p._id).join(' ');

    return {
        'userSession': userSession,
        'project': project
    };
};
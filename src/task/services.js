const { default: mongoose } = require('mongoose');
const { User } = require('../user/models.js');
const { Task } = require('./models.js');


module.exports.getTasks = async function (userSession) {
    let user = await User.findById(userSession._id);

    return await Task.find({ performers: user._id, creator: { $ne: user } });
};

module.exports.getEntrustedTasks = async function (userSession) {
    let user = await User.findById(userSession._id);

    return await Task.find({ creator: user });
};

module.exports.createTask = async function (userSession, body) {
    let user = await User.findById(userSession._id);
    let periodFrom = new Date(body.from) || null;
    let periodTo = new Date(body.to);

    await Task.create({
        name: body.name,
        description: body.description,
        project: body.project,
        creator: user,
        performers: body.performers || [],
        status: body.status,
        period: {
            from: periodFrom,
            to: periodTo
        }
    });
};

module.exports.updateTask = async function (userSession, taskId, body) {
    let user = await User.findById(userSession._id);
    let task = await Task.findById(taskId);

    if (task.creator !== user) {
        throw new Error(`You don't have access to modify this task`);
    }

    let fieldsToChange = {
        name: task.name,
        description: task.description,
        project: task.project,
        performers: task.performers,
        status: task.status,
        period: {
            from: task.period.from,
            to: task.period.to
        },
    };

    for (key in body) {
        if (key in fieldsToChange) {
            fieldsToChange[key] = body[key];
        }
    }

    await task.update({ $set: fieldsToChange });
};

module.exports.getTask = async function (userSession, taskId) {
    let user = await User.findById(userSession._id);
    let task = await Task.findById(taskId).populate('creator');

    if (!(user in task.performers) && !task.creator._id.equals(user._id)) {
        throw new Error(`You don't have access to view this task`);
    }

    return task;
};

module.exports.deleteTask = async function (userSession, taskId) {
    let user = await User.findById(userSession._id);
    let task = await Task.findById(taskId);

    if (task.creator !== user) {
        throw new Error(`You don't have access to delete this task`);
    }

    await task.delete();
};


module.exports.tasksPage = async function (userSession) {
    let tasks = await this.getTasks(userSession);
    let entrustedTasks = await this.getEntrustedTasks(userSession);

    return {
        'tasks': tasks,
        'entrustedTasks': entrustedTasks
    };
};

module.exports.taskPage = async function (userSession, taskId) {
    let task = await this.getTask(userSession, taskId);

    return { 'task': task };
};
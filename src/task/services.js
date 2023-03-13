const { User, UserProfile } = require('../user/models.js');
const { Task } = require('./models.js');
const { Comment } = require('../comment/models');


module.exports.getTasks = async function (userSession) {
    let user = await User.findById(userSession._id);

    return (await Task.find({ performers: user._id, creator: { $ne: user }, status: { $ne: 'done' } }))
        .sort((a, b) => a.period.to - b.period.to)
        .map(task => { task.isExpired = new Date() > task.period.to; return task; });
};

module.exports.getEntrustedTasks = async function (userSession) {
    let user = await User.findById(userSession._id);

    return (await Task.find({ creator: user, status: { $ne: 'done' } }))
        .sort((a, b) => a.period.to - b.period.to)
        .map(task => { task.isExpired = new Date() > task.period.to; return task; });
};

module.exports.createTask = async function (userSession, body) {
    let user = await User.findById(userSession._id);
    let periodFrom = new Date(body.from) || new Date();
    let periodTo = new Date(body.to);
    let performers = body.performers.trim().split(' ');

    console.log(performers);

    await Task.create({
        name: body.name,
        description: body.description,
        project: body.project,
        creator: user,
        performers: performers,
        status: body.status,
        period: {
            from: periodFrom,
            to: periodTo
        }
    });
};

module.exports.updateTask = async function (userSession, taskId, body) {
    let task = await Task.findById(taskId);

    if (!task.creator.equals(userSession._id)) {
        throw new Error(`You don't have access to modify this task`);
    }

    let fieldsToChange = {
        name: body.name.trim(),
        description: body.description.trim(),
        project: body.project.trim(),
        performers: body.performers.trim().split(' '),
        status: body.status,
        period: {
            from: body.periodFrom,
            to: body.periodTo
        },
    };

    return await task.updateOne({ $set: fieldsToChange });
};

module.exports.getTask = async function (userSession, taskId) {
    let user = await User.findById(userSession._id);
    let task = await Task.findById(taskId);

    if (!(task.performers.find(performer => performer.equals(user._id)) || task.creator.equals(user._id))) {
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
    let task = await (await this.getTask(userSession, taskId)).populate('project');
    let creatorProfile = await UserProfile.findOne({ user: task.creator });
    let performerProfiles = await UserProfile.find({ user: task.performers });
    let comments = await Comment.find({ task: task });

    task.isExpired = new Date() > task.period.to;
    for (let comment of comments) {
        comment.userProfile = await UserProfile.findOne({ user: comment.user });
    }

    return {
        'task': task,
        'creatorProfile': creatorProfile,
        'performerProfiles': performerProfiles,
        'comments': comments
    };
};

module.exports.updateTaskPage = async function (userSession, taskId) {
    let task = await (await this.getTask(userSession, taskId)).populate(['project', 'performers']);
    task.projectBlob = task.project.name;
    task.performersBlob = [];
    for (let performer of task.performers) {
        task.performersBlob.push(await UserProfile.findOne({ user: performer }));
    }
    task.performersBlob = task.performersBlob.map(p => p.getFullName()).join(', ');
    task.performerIds = task.performers.map(p => p._id).join(' ');

    return {
        'userSession': userSession,
        'task': task
    };
};
const { Comment } = require('./models');
const { User } = require('../user/models');
const { Task } = require('../task/models');


module.exports.createComment = async function (userSession, body) {
    let user = await User.findById(userSession._id);
    let task = await Task.findById(body.task);

    await Comment.create({
        user: user,
        task: task,
        body: body.body
    });
};

module.exports.updateComment = async function (userSession, commentId, body) {
    let user = await User.findById(userSession._id);
    let comment = await Comment.findById(commentId);

    if (comment.user !== user) {
        throw new Error(`You don't have access to modify this comment`);
    }

    let fieldsToChange = {
        body: comment.body,
    };

    for (key in body) {
        if (key in fieldsToChange) {
            fieldsToChange[key] = body[key];
        }
    }

    await body.update({ $set: fieldsToChange });
};

module.exports.deleteComment = async function (userSession, commentId) {
    let user = await User.findById(userSession._id);
    let comment = await Comment.findById(commentId);

    if (comment.user !== user) {
        throw new Error(`You don't have access to delete this comment`);
    }

    await comment.delete();
};

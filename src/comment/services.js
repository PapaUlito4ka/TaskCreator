const { Comment } = require('./models');
const { User } = require('../user/models');
const { Task } = require('../task/models');


module.exports.createComment = async function (userSession, body) {
    let user = await User.findById(userSession._id);
    let task = await Task.findById(body.task);

    await Comment.create({
        user: user,
        task: task,
        body: body.body.trim()
    });
};

module.exports.updateComment = async function (userSession, commentId, body) {
    let comment = await Comment.findById(commentId);

    if (!comment.user.equals(userSession._id)) {
        throw new Error(`You don't have access to modify this comment`);
    }

    let fieldsToChange = {
        body: body.body.trim()
    };

    return await comment.updateOne({ $set: fieldsToChange });
};

module.exports.deleteComment = async function (userSession, commentId) {
    let user = await User.findById(userSession._id);
    let comment = await Comment.findById(commentId);

    if (comment.user !== user) {
        throw new Error(`You don't have access to delete this comment`);
    }

    await comment.delete();
};

module.exports.updateCommentPage = async function (userSession, commentId) {
    let comment = await Comment.findById(commentId);

    return {
        'comment': comment,
        'userSession': userSession
    };
};
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const commentSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: ObjectId,
        ref: 'Task',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    modified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});


module.exports.Comment = mongoose.model('Comment', commentSchema);
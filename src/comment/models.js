const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const commentSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    task: {
        type: ObjectId,
        ref: 'Task'
    },
    body: {
        type: String,
        required: true
    },
    modified: {
        type: Boolean,
        default: false
    }
});


module.exports.Comment = mongoose.model('Comment', commentSchema);
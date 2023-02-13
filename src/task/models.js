const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    project: {
        type: ObjectId,
        ref: 'Project',
        required: true
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    performers: {
        type: [{
            type: ObjectId,
            ref: 'User',
        }],
        validate: [numberOfPerformers, '{PATH} must be >= 1']
    },
    status: {
        type: String,
        enum: ['created', 'in-progress', 'done'],
        default: 'created'
    },
    period: {
        from: { type: Date, default: new Date() },
        to: { type: Date, required: true }
    },
});

function numberOfPerformers(performers) {
    return performers.length > 0;
}


module.exports.Task = mongoose.model('Task', taskSchema);
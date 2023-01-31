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
        ref: 'Project'
    },
    creator: {
        type: ObjectId,
        ref: 'User'
    },
    performers: [{
        type: ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['created', 'in-progress', 'done']
    },
    period: {
        from: { type: Date, default: new Date() },
        to: { type: Date, required: true }
    },
    comments: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        body: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date()
        }
    }]
});


module.exports = mongoose.model('Task', taskSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    team: {
        type: ObjectId,
        ref: 'Team',
        required: true
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    workers: [{
        type: ObjectId,
        ref: 'User'
    }],
    period: {
        from: { type: Date, default: new Date() },
        to: { type: Date, required: true }
    }
});


module.exports.Project = mongoose.model('Project', projectSchema);
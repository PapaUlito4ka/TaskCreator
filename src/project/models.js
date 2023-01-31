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
        ref: 'Team'
    },
    creator: {
        type: ObjectId,
        ref: 'User'
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


module.exports = mongoose.model('Project', projectSchema);
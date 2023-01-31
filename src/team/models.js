const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    founder: {
        type: ObjectId,
        ref: 'User'
    },
    members: [{
        type: ObjectId,
        ref: 'User'
    }]
});


module.exports = mongoose.model('Team', teamSchema);
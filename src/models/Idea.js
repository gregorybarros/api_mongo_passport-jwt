const mongoose = require("../databases")
const Schema = mongoose.Schema


const Idea = new Schema({


    name: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: "workspaces",
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },

})


module.exports = mongoose.model('ideas', Idea)
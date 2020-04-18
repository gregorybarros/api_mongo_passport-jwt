const mongoose = require("../databases")
const Schema = mongoose.Schema


const Workspace = new Schema({

    name: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        
    },

})


module.exports = mongoose.model('workspaces', Workspace)
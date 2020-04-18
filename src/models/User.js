const mongoose = require("../databases")
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const User = new Schema ({
    
    name:{
        type:String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    password:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

})

User.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    next()
})
    
module.exports = mongoose.model("users", User)
    
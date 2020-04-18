const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/SennoTeste", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,

}).then(() => {
    console.log('✔ MongoDB connected!')
}).catch((err) => {
    console.log('Cannot possible connect MongoDB:'+err)
})

module.exports = mongoose
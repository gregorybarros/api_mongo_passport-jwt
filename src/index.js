const express = require("express")
const auth = require("./middlewares/auth")()
const cors = require("cors")
const routes = require("./routes")
require('./databases')

const app = express()

app.use(auth.initialize())

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(3333, () => {
    console.log('✔ Back-end started!')
  })

 const populateDb = require('./utils/populateDb') // Preencha o banco de dados SennoTeste com dados fakes usando Fakerjs
 //populateDb()
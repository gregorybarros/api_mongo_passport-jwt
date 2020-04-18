const express = require("express")
const config = require("./config/config")
const bcrypt = require("bcryptjs")
const jwt = require("jwt-simple")
const auth = require("./middlewares/auth")()

const User = require('./models/User')
const Workspace = require('./models/Workspace')
const Idea = require('./models/Idea')

const routes = express.Router()

// Recebe um POST com email e senha e retorna um TOKEN JWT
routes.post('/login', async (req, res) => {
    const { email, password } = req.body

    if(!email || !password || email === null || password === null || email === undefined || password === undefined) {
        return res.status(400).send({error: "Invalid email/password"})
    }
    else {
        await User.findOne({email}).then(async user => {

            if (!user)
            return res.status(400).send({error: 'User not found'})

            if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({error: 'Invalid password'})

            user.password = undefined

            res.send({user,token: jwt.encode(user, config.jwtSecret)})
        }).catch(err => {
            res.status(400).send({error: "Cannot find user" + err})
        })
    }

})

// Recebe o TOKEN JWT e lista as workspaces do usuario
routes.get('/my_workspaces', auth.authenticate(), async (req, res) => {
    const id = req.user._id

    await Workspace.find({user : id}).then(result => {

        if(result.length === 0) {
            return res.status(400).send({error: "Workspaces not found"})
        }

        res.send(result)
    }).catch(err => {
        res.status(400).send({error: "Workspaces not found"+ err})
    })

})

// Recebe o TOKEN JWT e o ID da workspace desejada e retorna o TOKEN JWT com a informação da WORKSPACE selecionada
routes.get('/set_workspace/:id', auth.authenticate(), async (req, res) => {
    const { id } = req.params
    let user = ''
    
    await User.findOne(req.user._id).then(result => {
        user = result
    }).catch (err => {
        res.status(400).send({error: 'User not found at token' + err})
    })
    await Workspace.findOne({_id: id}).then(result => {

        if(result.length === 0) {
            return res.status(400).send({error: "Workspace not found"})
        }

        const token = {
            _id: user._id,
            name: user.name,
            email: user.email,
            workspace: result._id
        }
        
        res.send({result,workspace: jwt.encode(token, config.jwtSecret)}) // retorna token com informacao da workspace
    }).catch(err => {
        res.status(400).send({error: "Workspace not found at token" + err})
    })

})

// Recebe o TOKEN JWT e lista todas as ideias na WORKSPACE
routes.get('/ideas', auth.authenticate(), async (req, res) => {

    const { workspace } = jwt.decode(req.headers.authorization, config.jwtSecret)

    await Idea.find({workspace}).then(result => {
        if(result.length === 0) {
            return res.status(400).send({error: "Ideas not found"})
        }

        res.send(result)
    }).catch(err => {
        res.status(400).send({error: "Ideas not found2"+ err})
    })

})

// Recebe o TOKEN JWT e lista todas as ideias do usuario na workspace
routes.get('/my_ideas', auth.authenticate(), async (req, res) => {
    const { workspace } = jwt.decode(req.headers.authorization, config.jwtSecret)

    const filter = {
        author: req.user._id,
        workspace
    }

    await Idea.find(filter).then(result => {

        if(result.length === 0) {
            return res.status(400).send({error: "Ideas not found"})
        }

        res.send(result)
    }).catch(err => {
        res.status(400).send({error: "Ideas not found"+ err})
    })
})


module.exports = routes
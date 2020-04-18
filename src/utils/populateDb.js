const faker = require('faker')

const User = require('../models/User')
const Workspace = require('../models/Workspace')
const Idea = require('../models/Idea')

faker.locale = "pt_BR"
const amount = 2

async function populateDb() {
    let users = []

    for (let index = 0; index < amount; index++) {
        let name =  faker.name.findName()

        let user = {
            name,
            email : faker.internet.email(name),
            password : '123456'
        }

        users.push(user)                      
    }

    await User.create(users).then(res => {
        users = res
    })

    users.forEach(async user => {
        let workspaces = []
        
        for (let index = 0; index < amount; index++) {
            let workspace = {
                name: faker.name.jobType(),
                user: user._id,
            }

            workspaces.push(workspace)     
        }

        await Workspace.create(workspaces).then(res => {
            workspaces = res
        })

        workspaces.forEach(async workspace => {

            let ideas = []

            for (let index = 0; index < amount; index++) {
                let idea = {
                    name: faker.name.jobTitle(),
                    author: user._id,
                    workspace: workspace._id,
                    description: faker.lorem.paragraph()
                }
                
                ideas.push(idea)
            }

    
            await Idea.create(ideas).then(res => {
                ideas = res

            })
        });
        
    });

    console.log('✔ Database populated!')
}

module.exports = populateDb
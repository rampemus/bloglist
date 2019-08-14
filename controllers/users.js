const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/api/users', async( request, response ) => {
    try {
        const body = request.body

        const saltRounds = 10

        const passwordHash = await bcrypt.hash( body.password, saltRounds )

        const user = new User( {
            username: body.username,
            name: body.name,
            passwordHash: passwordHash
        })

        const savedUser = await user.save()

        response.json(savedUser)

    } catch ( exception ) {
        console.log( exception )
    }
})

module.exports = usersRouter

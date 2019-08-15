const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
// const helper = require('../utils/user_helper')

usersRouter.post('/api/users', async( request, response ) => {

    const body = await request.body

    const saltRounds = await 10

    const passwordHash = await bcrypt.hash( body.password, saltRounds )
    //
    const user = await new User( {
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    })

    const savedUser = await user.save()
        .catch( error => {
            response.status(400).json({ error: error.message }).end()
        })

    response.status(201).json(savedUser).end()

})

module.exports = usersRouter

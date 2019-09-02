const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
// const helper = require('../utils/user_helper')

usersRouter.post('/', async( request, response ) => {

    const body = await request.body
    const saltRounds = await 10
    const passwordHash = await bcrypt.hash( body.password, saltRounds )

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

//gets public user information
usersRouter.get('/:username', async (request, response) => {
    const username = request.params.username
    const user = await User.find({ username: username }).populate('blogs')
    response.status(200).json({userid:user[0].id, username: user[0].username, blogs: user[0].blogs})
})

module.exports = usersRouter

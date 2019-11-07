const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
// const helper = require('../utils/user_helper')

usersRouter.post('/', async( request, response ) => {
  // TODO: Implement admin check here

  const body = await request.body
  const saltRounds = 10
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

usersRouter.get('/', async( request, response ) => {
  // TODO: implement some token checkin here
  const users = await User.find({})
  response.status(200).json(users)
})

usersRouter.get('/:id', async (request, response) => {
  // TODO: implement some token checkin here
  const id = request.params.id
  const user = await User.findById(id).populate('blogs')
  response.status(200).json(user)
})

module.exports = usersRouter

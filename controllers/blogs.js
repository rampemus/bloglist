const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')
const config = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  // TODO: implement some token checkin here
  const id = request.params.id
  const user = await Blog.findById(id).populate('user')
  response.status(200).json(user)
})

blogsRouter.post('/', async (request, response) => {

  const token = request.token

  try {
    const decodedToken = jwt.verify(token, config.JWT_SALT)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = await new Blog({ ...request.body, user:user.id })

    const result = await blog.save()

    //Find user and update blogs
    await User.findOneAndUpdate({ _id:user.id }, { blogs:[ ...user.blogs, blog._id ] }, { new: true, useFindAndModify:false })

    response.status(201).json(result)

  } catch( error ) {
    console.log(`response.status(400).json({ error: ${error.message} })`)
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, config.JWT_SALT)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const id = request.params.id
    const result = await Blog.findOneAndUpdate({ _id: id }, request.body, { new: true, useFindAndModify:false })
    response.status(202).json(result)
  } catch( error ) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {

  const token = request.token

  try {
    const decodedToken = jwt.verify(token, config.JWT_SALT)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (user.blogs.includes(request.params.id)) {
      const newBlogList = [ ...user.blogs.filter( blog => blog.toString() !== request.params.id) ]

      //Update users blogs-list
      await User.findOneAndUpdate({ _id:user.id }, { blogs: newBlogList }, { new: true, useFindAndModify:false })

      //Delete blog from data
      await Blog.deleteOne({ _id:request.params.id })

      response.status(204).end()
    } else {
      response.status(401).json({ error: 'blog post is not owned by user' })
    }

  } catch( error ) {
    console.log(`response.status(400).json({ error: ${error.message} })`)
    response.status(400).json({ error: error.message })
  }

})

module.exports = blogsRouter

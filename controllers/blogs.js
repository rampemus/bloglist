const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const cors = require('cors')
const bodyParser = require('body-parser')

blogsRouter.use(cors())
blogsRouter.use(bodyParser.json())

blogsRouter.get('/api/blogs', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
    const blog = await new Blog(request.body)
    const result = await blog.save()
        .catch( error => {
            response.status(400).json({ error: error.message }).end()
        })
    response.status(201).json(result)
})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
    await Blog.deleteOne({ _id:request.params.id })
        .catch( () => response.status(400).end())

    response.status(204).end()
})

module.exports = blogsRouter

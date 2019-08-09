const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const cors = require('cors')
const bodyParser = require('body-parser')

blogsRouter.use(cors())
blogsRouter.use(bodyParser.json())

blogsRouter.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

blogsRouter.delete('/api/blogs/:id', (request, response) => {
    Blog
        .findByIdAndRemove(request.params.id)
        .then( () => {
            response.status(204).end()
        })
        .catch( () => {
            response.status(400).end()
        })
})

module.exports = blogsRouter

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const cors = require('cors')
const bodyParser = require('body-parser')

blogsRouter.use(cors())
blogsRouter.use(bodyParser.json())

blogsRouter.get('/api/blogs', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
    const blog = await new Blog(request.body)

    const result = await blog.save()
        .catch( error => {
            response.status(400).json({ error: error.message }).end()
        })

    //Find user and update blogs
    const user = await User.findOne({ id:request.body.user.id })
        .catch( () => {
            console.log('couldn\'t find the user')
        })
    const body = user._doc
    const updateResponse = await User.findOneAndUpdate({ id:body.id }, { blogs:[ ...body.blogs, blog.id ] })

    console.log(updateResponse)

    response.status(201).json(result)
})

blogsRouter.put('/api/blogs/:id', async (request, response) => {
    const id = request.params.id
    const result = await Blog.findOneAndUpdate({ _id: id }, request.body, { new: true, useFindAndModify:false })
        .catch( error => response.status(400).json({ error: error.message }).end() )
    response.status(202).json(result)
})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
    await Blog.deleteOne({ _id:request.params.id })
        .catch( () => response.status(400).end())

    response.status(204).end()
})

module.exports = blogsRouter

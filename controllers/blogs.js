const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')
const config = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

    const token = request.token

    try {
        const decodedToken = jwt.verify(token, config.JWT_SALT)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const user = await User.findById(decodedToken.id)
            .catch( () => {
                console.log('couldn\'t find the user')
                response.status(400).json({ error: 'couldn\'t find the user' }).end()
            })

        const blog = await new Blog({ ...request.body, user:user.id })

        const result = await blog.save()
            .catch( error => {
                response.status(400).json({ error: error.message }).end()
            })


        //Find user and update blogs
        await User.findOneAndUpdate({ _id:user.id }, { blogs:[ ...user.blogs, blog._id ] }, { new: true, useFindAndModify:false })

        response.status(201).json(result)

    } catch( error ) {
        console.log('response.status(400).json({ error: error.message })')
        response.status(400).json({ error: error.message })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const result = await Blog.findOneAndUpdate({ _id: id }, request.body, { new: true, useFindAndModify:false })
        .catch( error => response.status(400).json({ error: error.message }).end() )
    response.status(202).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.deleteOne({ _id:request.params.id })
        .catch( () => response.status(400).end())

    response.status(204).end()
})

module.exports = blogsRouter

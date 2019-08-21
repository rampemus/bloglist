const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// console.log('connecting to', config.MONGO_URI)

const mongoUrl = config.MONGODB_URI

mongoose.set('useCreateIndex', true)
mongoose.connect(mongoUrl, { useNewUrlParser: true })

app.use(blogsRouter)

app.use(usersRouter)

app.use(loginRouter)


module.exports = app

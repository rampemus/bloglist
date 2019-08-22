const config = require('./utils/config')
const cors = require('cors')
const bodyParser = require('body-parser')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// console.log('connecting to', config.MONGO_URI)

app.use(cors())
app.use(bodyParser.json())

const mongoUrl = config.MONGODB_URI

mongoose.set('useCreateIndex', true)
mongoose.connect(mongoUrl, { useNewUrlParser: true })

app.use('/api/blogs', blogsRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)


module.exports = app

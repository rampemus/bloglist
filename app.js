const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

console.log('connectiong to', config.MONGO_URI)

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB: ', error.message)
    })

app.use(blogsRouter)

module.exports = app

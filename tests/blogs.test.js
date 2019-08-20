const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const config = require('../utils/config')

const api = supertest(app)

const realAmountOfBlogs = 2
let rootUser = ''

beforeEach( async () => {

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash( config.ROOT_PASSWORD, 10 )
    // const user =
    const user = new User({
        username: config.ROOT_USERNAME, name: 'Pasi Toivanen', passwordHash: passwordHash
    })
    rootUser = await user.save()
    // console.log(rootUser.id)

    await Blog.deleteMany({})

    await api
        .post('/api/blogs')
        .send({
            title:'React patterns',
            author:'Michael Chan',
            url:'https://reactpatterns.com/',
            likes:7,
            user: rootUser.id
        })

    await api
        .post('/api/blogs')
        .send({
            title:'Go To Statement Considered Harmful',
            author:'Edsger W. Dijkstra',
            url:'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes:5,
            user: rootUser.id
        })
})

describe('blog data retrieved correctly', () => {

    test(realAmountOfBlogs + ' existing blogs are returned as json', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body.length).toBe(realAmountOfBlogs)
    })

    test('blogs have correctly named id-fields', async () => {
        const response = await api.get('/api/blogs')
        for ( let i = 0; i < response.body.length; i++) {
            expect(response.body[i].id).toBeDefined()
        }
    })

})

describe('data of blog can be added and removed', () => {
    let testBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10
    }

    test('Blog can be added', async() => {

        await api
            .post('/api/blogs')
            .send(testBlog)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)

    })

    test('Added blog exists', async() => {

        const responseToPost = await api
            .post('/api/blogs')
            .send(testBlog)

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(realAmountOfBlogs+1)

        expect({ ...testBlog, __v:0, id:responseToPost.body.id }.toString()).toContain(response.body.find((blog) => {
            if ( blog.id === responseToPost.body.id) return blog
        }).toString())

    })

    test('Blog likes can be edited', async() => {
        const responseToPost = await api
            .post('/api/blogs')
            .send(testBlog)

        const response = await api
            .put( '/api/blogs/' + responseToPost.body.id )
            .send({ likes: 11 })
            .expect(202)

        const responseToGet = await api
            .get('/api/blogs')

        const resultedLikes = responseToGet.body.find( blog => {
            if ( blog.id === response.body.id ) return blog
        }).likes

        expect(resultedLikes).toBe(11)
    })

    test('Blog can be deleted', async() => {
        const responseToPost = await api
            .post('/api/blogs')
            .send(testBlog)

        await api
            .delete( '/api/blogs/' + responseToPost.body.id )
            .expect(204)
    })
})

describe('blogs are validated', () => {

    test('likes will return 0 when sent as empty', async () => {
        const blogWithoutLikes = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
        }

        const responseToPost = await api
            .post('/api/blogs')
            .send(blogWithoutLikes)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)

        await expect(responseToPost.body.likes).toBeDefined()
    })

    test('missing title returns 400', async () => {
        const blogWithoutTitle = {
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .send(blogWithoutTitle)
            .expect(400)
    })

    test('missing url returns 400', async () => {
        const blogWithoutUrl = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .send(blogWithoutUrl)
            .expect(400)
    })

})

afterAll( async () => {
    mongoose.connection.close()
})

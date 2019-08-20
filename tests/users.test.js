const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/user_helper')
const User = require('../models/user')
const config = require('../utils/config')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('case: initially one user in db with no references', () => {

    beforeEach( async() => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash( config.ROOT_PASSWORD, 10 )
        // const user =
        const user = new User({
            username: config.ROOT_USERNAME, name: 'Pasi Toivanen', passwordHash: passwordHash
        })
        await user.save()
    })

    const User1 = {
        username: config.TESTUSER1_USERNAME,
        name: 'Teuvo Testinen',
        password: config.TESTUSER1_PASSWORD
    }

    test('username creation works with a fresh username', async() => {

        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(User1)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(User1.username)

    })

    test('username creation does not work with used username', async() => {

        await api
            .post('/api/users')
            .send(User1)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        await api
            .post('/api/users')
            .send(User1)
            .expect(400)

    })

    test('usernames shorter than 3 will be refused', async() => {

        const shortUser = { ...User1, username: 'op' }

        await api
            .post('/api/users')
            .send(shortUser)
            .expect(400)

    })

})

describe('case: one user in db that has written all blogs', () => {
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
})

afterAll( async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash( config.ROOT_PASSWORD, 10 )
    // const user =
    const user = new User({
        username: config.ROOT_USERNAME, name: 'Pasi Toivanen', passwordHash: passwordHash
    })
    const rootUser = await user.save()
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

    mongoose.connection.close()
})

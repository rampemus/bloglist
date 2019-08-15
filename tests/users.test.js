const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/user_helper')
const User = require('../models/user')
const config = require('../utils/config')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('case: initially one user in db', () => {

    beforeEach( async() => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash( config.ROOT_PASSWORD, 10 )
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
})

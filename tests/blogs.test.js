const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const realAmountOfBlogs = 2

describe('blog data retrieved correctly', () => {

    test(realAmountOfBlogs + ' existing blogs are returned as json', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body.length).toBe(realAmountOfBlogs)
    })

    test('blogs have correctly named id-field', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

})

describe('blog data added correctly', () => {
    let testBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        likes: 10
    }

    test('Blog can be added', async() => {
        // const response =
        const response = await api
            .post('/api/blogs')
            .send(testBlog)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)

        const bodyLengthResponse = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(bodyLengthResponse.body.length).toBe(realAmountOfBlogs+1)

        await api
            .delete('/api/blogs/'+response.body.id)
            .expect(204)
    })
})

afterAll(() => {
    mongoose.connection.close()
})

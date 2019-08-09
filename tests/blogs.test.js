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

    let responseToPost = null

    test('Blog can be added', async() => {

        responseToPost = await api
            .post('/api/blogs')
            .send(testBlog)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)

    })

    test('Added blog exists', async() => {

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(realAmountOfBlogs+1)

        expect({ ...testBlog, __v:0, id:responseToPost.body.id }.toString()).toContain(response.body.find((blog) => {
            if ( blog.id === responseToPost.body.id) return blog
        }).toString())

    })

    test('Blog can be deleted', async() => {
        await api
            .delete('/api/blogs/'+responseToPost.body.id)
            .expect(204)
    })
})

afterAll(() => {
    mongoose.connection.close()
})

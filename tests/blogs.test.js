const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const realAmountOfBlogs = 2

//before running the tests make sure that data in the test db is
// {
//     _id:5d4c156bbd1fa4efeb6594b0
//     title:"React patterns"
//     author:"Michael Chan"
//     url:"https://reactpatterns.com/"
//     likes:7
//     __v:0
// }
// {
//     _id:5d4d76eb0369c62ce3b2e4b9
//     title:"Go To Statement Considered Harmful"
//     author:"Edsger W. Dijkstra"
//     url:"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html"
//     likes:5
//     __v:0
// }

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

describe('blogs are validated', async () => {

    let responseToPost = null

    test('likes will be 0 when sent as empty', async () => {
        const blogWithoutLikes = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
        }

        responseToPost = await api
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

    const response = await api
        .get('/api/blogs')

    for ( let i = 0; i < response.body.length; i++ ) {
        if ( response.body[i].id.toString() !== '5d4c156bbd1fa4efeb6594b0'
            && response.body[i].id.toString() !== '5d4d76eb0369c62ce3b2e4b9' ) {
            await api
                .delete('/api/blogs/'+response.body[i].id)
        }
    }

    mongoose.connection.close()
})

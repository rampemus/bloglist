const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const listWithOneBlog = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    }
]

const listWithBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

describe('total likes', () => {
    test(`when list of blogs is ${listWithOneBlog.length} long and has 7 likes`, () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(7)
    })

    test(`when list of blogs is ${listWithBlogs.length} long and has total of 36`, () => {
        const result = listHelper.totalLikes(listWithBlogs)
        expect(result).toBe(36)
    })
})

describe('top lists', () => {
    test('most popular blog', () => {
        const result = listHelper.favoriteBlog(listWithBlogs)
        expect(result).toEqual(listWithBlogs[2])
    })
    test('most blogs written writer', () => {
        const result = listHelper.mostBlogs(listWithBlogs)
        expect(result).toEqual({ name: 'Robert C. Martin', blogs: 3 })
    })
    test('most liked writer', () => {
        const result = listHelper.mostLikes(listWithBlogs)
        expect(result).toEqual({ name: 'Edsger W. Dijkstra', likes: 17 })
    })
})

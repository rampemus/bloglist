// const lodash = require('lodash')

const dummy = (blogs) => {
  if (blogs.length >= 0) {
    return 1
  } else {
    return 0
  }
}

const totalLikes = (blogs) => {
  return blogs.reduce((first, next) => ( { likes: first.likes + next.likes } )).likes
}

const favoriteBlog = (blogs) => {
  const likesMax = Math.max.apply(Math, blogs.map( blog => blog.likes ))
  return blogs.find(blog => blog.likes === likesMax )
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(blog => blog.author) //get author names with duplicates
  let authorTable = authors.filter((value, index, self) => self.indexOf(value) === index) //remove duplicates
    .map(author => {return { //create a table of authors and a sum value calculator
      'name': author,
      'blogs': 0
    }})

  for (let i = 0; i < authors.length; i++) {
    authorTable.find(author => author.name === authors[i]).blogs++ //add one for every finding
  }

  //put table in order of blogs
  authorTable.sort( (author1,author2) => author2.blogs - author1.blogs)

  return authorTable[0]
}

const mostLikes = (blogs) => {
  const authors = blogs.map(blog => blog.author) //get author names with duplicates
  let authorTable = authors.filter((value, index, self) => self.indexOf(value) === index) //remove duplicates
    .map(author => {return { //create a table of authors and a sum value calculator
      'name': author,
      'likes': 0
    }})

  for (let i = 0; i < blogs.length; i++) {
    authorTable.find(author => author.name === blogs[i].author).likes += blogs[i].likes //sum the likes
  }

  // console.log('Most liked table: ', authorTable)
  //put table in order of likes
  authorTable.sort( (author1,author2) => author2.likes - author1.likes)

  return authorTable[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

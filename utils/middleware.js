const getTokenFrom = request => {
  const authorization = request.get('authorization')
  const schema = 'bearer'
  if ( authorization && authorization.toLowerCase().startsWith(schema + ' ') ) {
    return authorization.substring(schema.length + 1)
  }
  return null
}

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  // console.log('Header: ', request.headers)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

//TODO:test this
const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request)
  next()
}

module.exports = {
  requestLogger,
  tokenExtractor
}

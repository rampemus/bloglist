require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

let ROOT_USERNAME = ''
let ROOT_PASSWORD = ''

let TESTUSER1_USERNAME = ''
let TESTUSER1_PASSWORD = ''

if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI

    ROOT_USERNAME = process.env.ROOT_USERNAME
    ROOT_PASSWORD = process.env.ROOT_PASSWORD

    TESTUSER1_USERNAME = process.env.TESTUSER1_USERNAME
    TESTUSER1_PASSWORD = process.env.TESTUSER1_PASSWORD
}

module.exports = {
    MONGODB_URI,
    PORT,
    ROOT_USERNAME,
    ROOT_PASSWORD,
    TESTUSER1_USERNAME,
    TESTUSER1_PASSWORD
}

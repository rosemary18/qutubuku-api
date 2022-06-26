const {firebaseApp, firestoreDB} = require('./firebase')
const server = require('./server')

module.exports = {
    server,
    firebaseApp,
    firestoreDB
}
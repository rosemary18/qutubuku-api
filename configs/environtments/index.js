const development = require('./development')
const production = require('./production')

module.exports = process.env.NODE === 'production' ? production : development
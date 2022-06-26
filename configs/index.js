const credentials = require('./credentials')
const keys = require('./environtments')

module.exports = {
    ...credentials,
    keys
}
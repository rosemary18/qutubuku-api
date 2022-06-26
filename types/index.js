const validator = require('./validator')
const FETCH_REQUEST_TYPES = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
}

const ERROR_CODE = {
    404: {
        id: '404',
        description: 'Alamat tidak ditemukan'
    },
    '0X0001': {
        id: '0X0001',
        description: 'User exist'
    }
}

module.exports = {
    validator,
    FETCH_REQUEST_TYPES,
    ERROR_CODE
}
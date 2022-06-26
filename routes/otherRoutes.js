const abs_path = '/'
const { FETCH_REQUEST_TYPES } = require('../types')
const Path = require('path')

// Handlers

const handler404 = async (req, res) => {
    return res.file('404.html')
} 

const handlerIndex = async (req, res) => {
    return res.file('index.html')
}

// Routing

const routes = [
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path,
        handler: handlerIndex,
        options: {
            auth: false
        }
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path +'css/{filename}',
        handler: (req,res) => {
            return res.file(`static/assets/css/${req.params.filename}`)
        },
        options: {
            auth: false
        }
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path +'images/{filename}',
        handler: (req,res) => {
            return res.file(`static/images/${req.params.filename}`)
        },
        options: {
            auth: false
        }
    },
    {
        method: [FETCH_REQUEST_TYPES.GET, FETCH_REQUEST_TYPES.POST, FETCH_REQUEST_TYPES.PUT, FETCH_REQUEST_TYPES.DELETE],
        path: abs_path + '{any*}',
        handler: handler404
    }
]

module.exports = routes
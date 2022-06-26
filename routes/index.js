const userRoutes = require('./userRoutes')
const productRoutes = require('./productRoutes')
const cartRoutes = require('./cartRoutes')
const invoiceRoutes = require('./invoiceRoutes')
const catalogRoutes = require('./catalogRoutes')
const otherRoutes = require('./otherRoutes')

const routes = [
    ...userRoutes,
    ...productRoutes,
    ...cartRoutes,
    ...invoiceRoutes,
    ...catalogRoutes,
    ...otherRoutes
]

module.exports = routes
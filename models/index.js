const CollectionUser = require('./userModel')
const CollectionCart = require('./cartModel')
const CollectionProduct = require('./productModel')
const CollectionInvoice = require('./invoiceModel')
const CollectionOrder = require('./orderModel')
const CollectionCatalog = require('./catalogModel')

module.exports = {
    CollectionUser,
    CollectionCart,
    CollectionInvoice,
    CollectionProduct,
    CollectionOrder,
    CollectionCatalog
}
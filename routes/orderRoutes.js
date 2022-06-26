const abs_path = '/api/order'
const { FETCH_REQUEST_TYPES } = require("../types")
const { firestoreDB } = require('../services/firebase')
const { CollectionOrder } = require('../models')
const { result } = require("./utils")
const { collection } = require("firebase/firestore")

// CollectionRef

const colRef = collection(firestoreDB, 'orders_collection')
const colProductRef = collection(firestoreDB, 'products_collection')

// Handlers

const handlerGetOrders = async (req, res) => {

    const data = []
    const orders = await getDocs(colRef)
    orders.forEach((item) => data.push({id: item.id, ...item.data()}))
    const products = await getDocs(colProductRef)
    products.forEach((item) => {
        data.map((order, i) => {
            if (order.product_id === item.id) data[i].product = {id: item.id, ...item.data()} 
        })
    })

    return result({res, data, status: 200, total: data.length})
}

const handlerGetOrder = async (req, res) => {

    const {order_id} = req.params

    const docOrderRef = doc(colRef, order_id)

    const order = await getDoc(docOrderRef)
    const data_order = {id: order.id, ...order.data()}
    
    if (Object.keys(data_order).length > 0) {

            const docProductRef = doc(colProductRef, data_product.product_id)
            const product = await getDoc(docProductRef)
            const data_product = {id: product.id, ...product.data()}

            if (Object.keys(data_product).length > 0) data_order.product = data_product

            return result({res, data: data_order})
    } else return result({res, status: 404, msg: "Product doesn't exist"})
}

const handlerCreateOrder = async (req, res) => {

    return result({res})
}

const handlerUpdateOrder = async (req, res) => {

    return result({res})
}

const handlerDeleteOrder = async (req, res) => {

    return result({res})
}

// Routing

const routes = [
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path,
        handler: handlerGetOrders
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path + '/{order_id}',
        handler: handlerGetOrder
    },
    {
        method: FETCH_REQUEST_TYPES.POST,
        path: abs_path,
        handler: handlerCreateOrder
    },
    {
        method: FETCH_REQUEST_TYPES.PUT,
        path: abs_path + '/{order_id}',
        handler: handlerUpdateOrder
    },
    {
        method: FETCH_REQUEST_TYPES.DELETE,
        path: abs_path + '/{order_id}',
        handler: handlerDeleteOrder
    },
]

module.exports = routes
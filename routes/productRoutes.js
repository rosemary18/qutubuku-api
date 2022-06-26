const abs_path = '/api/product'
const { FETCH_REQUEST_TYPES } = require("../types")
const { firestoreDB } = require('../services/firebase')
const { CollectionProduct } = require('../models')
const { result } = require("./utils")
const { collection, addDoc, doc, getDoc, getDocs, query, where, deleteDoc, updateDoc } = require("firebase/firestore")
const dayjs = require("dayjs")

// CollectionRef

const colRef = collection(firestoreDB, 'products_collection')

// Handlers

const handlerGetProducts = async (req, res) => {

    const {search, categories, author, published_date} = req.query
    const data = []
    const products = await getDocs(colRef)
    
    products.forEach((item) => {
        const _data = item.data()
        if (!search) {
            data.push({id: item.id, ..._data})
        } else {
            if (_data.name.toLowerCase().includes(search.toLowerCase())) data.push({id: item.id, ..._data})
        }
    })

    return result({res, data, status: 200, total: data.length})
}

const handlerGetProduct = async (req, res) => {

    const {product_id} = req.params
    const docRef = doc(colRef, product_id)
    const product = await getDoc(docRef)
    const data = {id: product.id, ...product.data()}

    return result({res, data})
}

const handlerAddProduct = async (req, res) => {

    const payload = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload
    const {name, stock, price} = payload

    if (!name || !stock || !price) return result({res, status: 400, msg: "Data yang diperlukan tidak cukup"})

    // Create product from model instance
    const newProduct = new CollectionProduct(payload).toObject()
    
    // Add product
    const addRef = await addDoc(colRef, newProduct).catch(err => console.log(err))
    const docRef = doc(colRef, addRef.id)
    const product = await getDoc(docRef).catch(err => console.log(err))
    const data = {id: product.id, ...product.data()}

    // Send response 
    return result({res, data, msg: 'Add product successfully'})
}

const handlerUpdateProduct = async (req, res) => {

    const payload = typeof req.payload === 'string' ? JSON.parse(req.payload) : req.payload
    const {name, stock, price, unit, photo, author, published_date, categories} = payload
    const {product_id} = req.params

    // Search product
    const docRef = doc(colRef, product_id)
    const product = await getDoc(docRef)
    const data = {id: product.id, ...product.data()}

    if (Object.keys(data).length > 0) {
        
        // Store data
        const updateData = {}
        name && (updateData.name = name)
        price && (updateData.price = price)
        unit && (updateData.unit = unit)
        photo && (updateData.photo = photo)
        author && (updateData.author = author)
        published_date && (updateData.published_date = dayjs(published_date).format("YYYY-MM-DD"))
        categories && (updateData.categories = categories)
        
        if (stock) {
            updateData.stock = Math.max(stock-data.stock_hold, 0)
            updateData.total_stock = parseFloat(stock)
        }

        // Update product
        await updateDoc(docRef, updateData)
        const product_updated = await getDoc(docRef)
        const data_updated = {id: product_updated.id, ...product_updated.data()}
    
        // Send response 
        return result({res, data: data_updated, msg: 'Update product successfully'})
    } 
    else return result({res, status: 400, msg: `Product ${product_id} not found`})
}

const handlerDeleteProduct = async (req, res) => {

    const {product_id} = req.params
    
    // Deleting
    const docRef = doc(colRef, product_id)
    await deleteDoc(docRef).catch(err => {
        console.log(err)
        return result({res, msg: `Delete product ${product_id} failed`})
    })
    
    return result({res, msg: `Delete product ${product_id} successfully`})
}

// Routing

const routes = [
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path,
        handler: handlerGetProducts
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path + '/{product_id}',
        handler: handlerGetProduct
    },
    {
        method: FETCH_REQUEST_TYPES.POST,
        path: abs_path + '/add',
        handler: handlerAddProduct,
        options: {
            payload: {
                output: 'data',
                parse: true
            }
        }
    },
    {
        method: FETCH_REQUEST_TYPES.PUT,
        path: abs_path + '/{product_id}',
        handler: handlerUpdateProduct
    },
    {
        method: FETCH_REQUEST_TYPES.DELETE,
        path: abs_path + '/{product_id}',
        handler: handlerDeleteProduct
    }
]

module.exports = routes
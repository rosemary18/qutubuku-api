const abs_path = '/api/cart'
const { FETCH_REQUEST_TYPES } = require("../types")
const { firestoreDB } = require('../services/firebase')
const { CollectionCart } = require('../models')
const { result } = require("./utils")
const { collection, doc, getDoc, addDoc, getDocs, updateDoc, deleteDoc } = require("firebase/firestore")

// CollectionRef

const colRef = collection(firestoreDB, 'carts_collection')
const colProductRef = collection(firestoreDB, 'products_collection')
const colUserRef = collection(firestoreDB, 'users_collection')

// Handlers

const handlerGetCarts = async (req, res) => {

    const {user} = req.auth.credentials

    const data = []
    const carts = await getDocs(colRef)
    const products = await getDocs(colProductRef)

    carts.forEach(async (item) => data.push({id: item.id, ...item.data(), user}))
    
    products.forEach(async (item) => {
        data.map((cart, i) => {
            if (item.id === cart.product_id) {
                data[i].product = {id: item.id, ...item.data()}
            }
        })
    })

    return result({res, data, status: 200, total: data.length})
}

const handlerGetCartByUser = async (req, res) => {

    const {user} = req.auth.credentials

    const data = []
    const carts = await getDocs(colRef)
    const products = await getDocs(colProductRef)

    carts.forEach(async (item) => {
        let _item = item.data()
        if (_item.user_id === user.id) data.push({id: item.id, ..._item, user})
    })

    products.forEach(async (item) => {
        data.map((cart, i) => {
            if (item.id === cart.product_id) {
                data[i].product = {id: item.id, ...item.data()}
            }
        })
    })

    return result({res, data, status: 200, total: data.length})
}

const handlerGetCart = async (req, res) => {

    const {cart_id} = req.params
    const docRef = doc(colRef, cart_id)
    const cart = await getDoc(docRef)
    const data = {id: cart.id, ...cart.data()}

    if (Object.keys(data).length > 0) {

        const docProductRef = doc(colProductRef, data.product_id)
        const product = await getDoc(docProductRef)
        const data_product = {id: product.id, ...product.data()}
        data.product = data_product

        return result({res, data})
    } else return result({res, status: 404, msg: 'Cart tidak ditemukan'})
}

const handlerAddCart = async (req, res) => {

    const {product_id, quantity} = req.payload
    const {user} = req.auth.credentials

    const docProductRef = doc(colProductRef, product_id)
    const product = await getDoc(docProductRef)
    const data_product = {...product.data()}

    if (Object.keys(data_product).length > 0) {

        const values = {
            user_id: user.id,
            product_id,
            quantity: parseFloat(quantity)
        }
    
        // Create new cart from instance
        const newCart = new CollectionCart(values).toObject()
    
        // Add cart
        const addRef = await addDoc(colRef, newCart).catch(err => console.log(err))
        await updateDoc(docProductRef, {
            stock: data_product.stock - parseInt(quantity),
            stock_hold: data_product.stock_hold + parseInt(quantity)
        })
        const docRef = doc(colRef, addRef.id)
        const cart = await getDoc(docRef).catch(err => console.log(err))
        const data = {id: cart.id, ...cart.data()}
    
        // Send response 
        return result({res, data, msg: 'Add cart successfully'})
    } else return result({res, status: 404, msg: "Product doesn't exist"})
}

const handlerUpdateCart = async (req, res) => {

    const {quantity} = req.payload || {}
    const {cart_id} = req.params

    if (!quantity) return result({res, status: 400, msg: "There is no data updated"})

    // Search for existing cart
    const docRef = doc(colRef, cart_id);
    const cart = await getDoc(docRef).catch(err => console.log(err))
    const data_cart = {id: cart.id, ...cart.data()}
    
    // If exist cart
    if (Object.keys(data_cart).length > 0)  {

        const docProductRef = doc(colProductRef, data_cart.product_id);
        const product = await getDoc(docProductRef).catch(err => console.log(err))
        const data_product = {id: product.id, ...product.data()}

        if (Object.keys(data_product).length > 0) {

            if (parseInt(quantity) > data_product.stock) return result({res, status: 400, msg: "Product stock doesn't enough"})
            else {

                // Create values
                const values = {quantity: parseInt(quantity)}
                
                // Updating
                await updateDoc(docRef, values)
                await updateDoc(docProductRef, {
                    stock: data_product.stock - (parseInt(quantity) - data_cart.quantity),
                    stock_hold: Math.max(data_product.stock_hold + (parseInt(quantity) - data_cart.quantity), 0)
                })

                const updated_product = await getDoc(docProductRef).catch(err => console.log(err))
                const data_product_updated = {id: updated_product.id, ...updated_product.data()}
                const updated_cart = await getDoc(docRef).catch(err => console.log(err))
                const data = {id: updated_cart.id, ...updated_cart.data(), product: data_product_updated}
            
                // Send response 
                return result({res, data, msg: 'User updated'})
            }
        } else return result({res, status: 404, msg: "Product on cart doesn't exist"})
    } else return result({res, status: 404, msg: "Cart doesn't exist"})
}

const handlerDeleteCart = async (req, res) => {

    const {cart_id} = req.params

    // Search for existing cart
    const docRef = doc(colRef, cart_id);
    const cart = await getDoc(docRef).catch(err => console.log(err))
    const data_cart = {id: cart.id, ...cart.data()}

    if (Object.keys(data_cart).length > 0) {

        const docProductRef = doc(colProductRef, data_cart.product_id);
        const product = await getDoc(docProductRef).catch(err => console.log(err))
        const data_product = {id: product.id, ...product.data()}

        // Deleting
        await deleteDoc(docRef).catch(err => {
            console.log(err)
            return result({res, msg: `Delete cart ${cart_id} failed`})
        })

        await updateDoc(docProductRef, {
            stock: data_product.stock + data_cart.quantity,
            stock_hold: Math.max(data_product.stock_hold - data_cart.quantity, 0)
        })
        
        return result({res, msg: `Delete cart ${cart_id} successfully`})

    } else return result({res, status: 404, msg: "Cart doesn't exist"})
}

// Routing

const routes = [
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path + '/all',
        handler: handlerGetCarts
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path,
        handler: handlerGetCartByUser
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path + '/{cart_id}',
        handler: handlerGetCart
    },
    {
        method: FETCH_REQUEST_TYPES.POST,
        path: abs_path,
        handler: handlerAddCart
    },
    {
        method: FETCH_REQUEST_TYPES.PUT,
        path: abs_path + '/{cart_id}',
        handler: handlerUpdateCart
    },
    {
        method: FETCH_REQUEST_TYPES.DELETE,
        path: abs_path + '/{cart_id}',
        handler: handlerDeleteCart
    },
]

module.exports = routes
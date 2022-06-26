const abs_path = '/api/invoice'
const { FETCH_REQUEST_TYPES } = require("../types")
const { firestoreDB } = require('../services/firebase')
const { CollectionInvoice } = require('../models')
const { result } = require("./utils")
const { collection } = require("firebase/firestore")

// CollectionRef

const colRef = collection(firestoreDB, 'invoices_collection')

// Handlers

const handlerGetInvoices = async (req, res) => {

    const data = []
    const products = await getDocs(colRef)
    products.forEach((item) => data.push({id: item.id, ..._data}))

    return result({res, data, status: 200, total: data.length})
}

const handlerGetInvoice = async (req, res) => {

    const {invoice_id} = req.params
    const docRef = doc(colRef, invoice_id)
    const invoice = await getDoc(docRef)
    const data = {id: invoice.id, ...invoice.data()}

    return result({res, data})
}

const handlerUpdateInvoice = async (req, res) => {

    const {invoice_id} = req.params
    
    
    return result({res})
}

const handlerDeleteInvoice = async (req, res) => {

    const {invoice_id} = req.params
    
    // Deleting
    const docRef = doc(colRef, invoice_id)
    await deleteDoc(docRef).catch(err => {
        console.log(err)
        return result({res, msg: `Delete invoice ${invoice_id} failed`})
    })
    
    return result({res, msg: `Delete invoice ${invoice_id} successfully`})
}

// Routing

const routes = [
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path,
        handler: handlerGetInvoices
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path + '/{invoice_id}',
        handler: handlerGetInvoice
    },
    {
        method: FETCH_REQUEST_TYPES.PUT,
        path: abs_path + '/{invoice_id}',
        handler: handlerUpdateInvoice
    },
    {
        method: FETCH_REQUEST_TYPES.DELETE,
        path: abs_path + '/{invoice_id}',
        handler: handlerDeleteInvoice
    },
]

module.exports = routes
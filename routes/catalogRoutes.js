const abs_path = '/api/catalog'
const { FETCH_REQUEST_TYPES } = require("../types")
const { firestoreDB } = require('../services/firebase')
const { CollectionCatalog } = require('../models')
const { result } = require("./utils")
const { collection, doc, getDoc, addDoc, getDocs, updateDoc, deleteDoc, query, where } = require("firebase/firestore")

// CollectionRef

const colRef = collection(firestoreDB, 'catalogues_collection')

// Handlers

const handlerGetCatalogues = async (req, res) => {

    const data = []
    const catalogues = await getDocs(colRef)

    catalogues.forEach(async (item) => data.push({...item.data()}))

    return result({res, data, status: 200, total: data.length})
}

const handlerGetCatalog = async (req, res) => {

    const {catalog_id} = req.params

    let data = {}
    const q = query(colRef, where("id", "==", catalog_id))
    const catalog = await getDocs(q)
    catalog.forEach((item) => (data = {...item.data()}))

    if (Object.keys(data).length > 0) return result({res, data})
    else return result({res, status: 404, msg: "Catalog doesn't exist"})
}

const handlerAddCatalog = async (req, res) => {

    const {name} = req.payload || {}

    if (!name) return result({res, status: 400, msg: 'Data required'})

    // Create new catalog from instance
    const newCatalog = new CollectionCatalog({name}).toObject()

    // Add catalog
    const addRef = await addDoc(colRef, newCatalog).catch(err => console.log(err))
    const docRef = doc(colRef, addRef.id)
    const catalog = await getDoc(docRef).catch(err => console.log(err))
    const data = {...catalog.data()}

    // Send response 
    return result({res, data, msg: 'Add catalog successfully'})
}

const handlerUpdateCatalog = async (req, res) => {

    const {name} = req.payload || {}
    const {catalog_id} = req.params

    if (!name) return result({res, status: 400, msg: "There is no data updated"})

    // Search for existing catalog
    let data_catalog = {}
    const q = query(colRef, where("id", "==", catalog_id))
    const catalog = await getDocs(q)
    catalog.forEach((item) => (data_catalog = {_id: item.id,...item.data()}))
    
    // If exist catalog
    if (Object.keys(data_catalog).length > 1)  {

        const values = {name}
        
        // Updating
        const docRef = doc(colRef, data_catalog._id)
        await updateDoc(docRef, values)

        const updated_catalog = await getDoc(docRef).catch(err => console.log(err))
        const data = {_id: updated_catalog.id, ...updated_catalog.data()}
    
        // Send response 
        return result({res, data, msg: 'Catalog updated'})
    } else return result({res, status: 404, msg: "Catalog doesn't exist"})
}

const handlerDeleteCatalog = async (req, res) => {

    const {catalog_id} = req.params

    // Search for existing catalog
    let data_catalog = {}
    const q = query(colRef, where("id", "==", catalog_id));
    const catalogs = await getDocs(q).catch(err => console.log(err))
    catalogs.forEach((item) => (data_catalog = {_id: item.id, ...item.data()}))

    if (Object.keys(data_catalog).length > 0) {

        // Deleting
        const docRef = doc(colRef, data_catalog._id)
        await deleteDoc(docRef).catch(err => {
            console.log(err)
            return result({res, msg: `Delete catalog ${catalog_id} failed`})
        })
        
        return result({res, msg: `Delete catalog ${catalog_id} successfully`})
    } else return result({res, status: 404, msg: "Catalog doesn't exist"})
}

// Routing

const routes = [
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path,
        handler: handlerGetCatalogues,
        options: {
            auth: false
        }
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path + '/{catalog_id}',
        handler: handlerGetCatalog,
        options: {
            auth: false
        }
    },
    {
        method: FETCH_REQUEST_TYPES.POST,
        path: abs_path,
        handler: handlerAddCatalog
    },
    {
        method: FETCH_REQUEST_TYPES.PUT,
        path: abs_path + '/{catalog_id}',
        handler: handlerUpdateCatalog
    },
    {
        method: FETCH_REQUEST_TYPES.DELETE,
        path: abs_path + '/{catalog_id}',
        handler: handlerDeleteCatalog
    },
]

module.exports = routes
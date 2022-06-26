const abs_path = '/api/user'
const {collection, getDocs, getDoc, doc, addDoc, query, where, deleteDoc, updateDoc} = require('firebase/firestore')
const { firestoreDB } = require('../services/firebase')
const Jwt = require('jsonwebtoken')
const { FETCH_REQUEST_TYPES, ERROR_CODE } = require('../types')
const { result } = require('./utils')
const { keys } = require('../configs')
const { CollectionUser } = require('../models')
const bcrypt = require("bcryptjs");

// CollectionRef

const colRef = collection(firestoreDB, 'users_collection')

// Handlers

const handlerGetUsers = async (req, res) => {
    
    const users = await getDocs(colRef)
    const data = []
    users.forEach((item) => data.push({id: item.id, ...item.data()}))

    return result({res, data: data, status: 200})
} 

const handlerGetUser = async (req, res) => {
    
    const {user_id} = req.params
    const docRef = doc(colRef, user_id)
    const user = await getDoc(docRef)
    const data = {id: user.id, ...user.data()}

    return result({res, data})
}

const handlerGetMyAccount = async (req, res) => {
    
    const {user} = req.auth.credentials

    const docRef = doc(colRef, user.id)
    const user_data = await getDoc(docRef)
    const data = {id: user_data.id, ...user_data.data()}

    return result({res, data})
}

const handlerLogin = async (req, res) => {

    const {email, password} = req.payload
    const newData = {
        email: email,
        password: password
    }

    // Check form data
    if (!email) return result({res, status: 400, msg: 'Email dibutuhkan'})
    if (!password) return result({res, status: 400, msg: 'Password dibutuhkan'})
    
    // Check user
    const q = query(colRef, where("email", "==", email))
    const user = await getDocs(q)
    let data = {}
    user.forEach((doc) => { data = {id: doc.id, ...doc.data()}});

    if (Object.keys(data).length > 0) {

        // Check password
        const isMatch = await bcrypt.compare(password, data.password)

        // Password missmatch
        if (!isMatch) return result({res, status: 400, msg: 'Password anda salah'})
        // Password match
        else {
            
            const payload = {
                id: data.id,
                email: data.email,
                name: data.name,
                gender: data.gender
            }

            const token = Jwt.sign({user: payload}, keys.JWT_SECRET_KEY, { expiresIn: 86400 });
            
            // Token created and user successfully logged in
            if(token) {
                newData.token = token
                return result({res, data: newData})
            }
            
            // Token failed to create
            return result({res, status: 500, msg: 'Login failed'})
        }
    } else return result({res, status: 400, msg: 'User tidak ditemukan'})
}

const handlerRegister = async (req, res) => {

    const {name, gender, email, address, password, mobile} = req.payload || {}

    if (!name || !gender || !email || !address || !password || !mobile) return result({res, status: 400, msg: "Data belum lengkap"})

    // Search for existing user
    const q = query(colRef, where("email", "==", email));
    const user = await getDocs(q).catch(err => console.log(err))
    let data = {}
    user?.forEach((doc) => { data = {id: doc.id, ...doc?.data()}});

    // If exist user
    if (Object.keys(data).length > 0) return result({res, status: 400, error_code: ERROR_CODE['0X0001'].id, msg: ERROR_CODE['0X0001'].description})

    // Register user if user not exist
    else {

        // Create user from model instance
        const newUser = new CollectionUser({
            name: name,
            gender: parseInt(gender),
            password: password,
            email: email,
            address: address,
            mobile: mobile
        }).toObject()

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt)
        newUser.password = hash
        
        // Registering
        const addRef = await addDoc(colRef, newUser).catch(err => console.log(err))
        const docRef = doc(colRef, addRef.id)
        const user = await getDoc(docRef).catch(err => console.log(err))
        const data = {id: user.id, ...user.data()}

        // Send response 
        return result({res, data, msg: 'Registration successfully'})
    }
}

const handlerUpdateUser = async (req, res) => {

    const {name, gender, email, address, mobile} = req.payload || {}
    const {user_id} = req.params

    if (!name && !gender && !email && !address && !mobile) return result({res, status: 400, msg: "There is no data updated"})

    // Search for existing user
    const docRef = doc(colRef, user_id);
    const user = await getDoc(docRef).catch(err => console.log(err))
    const data_user = {id: user.id, ...user.data()}
    
    // If exist user
    if (Object.keys(data_user).length > 0)  {
        
        // Create values
        const values = {}
        name && (values.name = name)
        gender && (values.gender = parseInt(gender))
        email && (values.email = email)
        address && (values.address = address)
        mobile && (values.mobile = mobile)
        
        // Updating
        await updateDoc(docRef, values)
        const updated_user = await getDoc(docRef).catch(err => console.log(err))
        const data = {id: updated_user.id, ...updated_user.data()}
    
        // Send response 
        return result({res, data, msg: 'User updated'})
    } else return result({res, status: 404, msg: "User not found"})
}

const handlerDeleteUser= async (req, res) => {

    const {user_id} = req.params
    
    // Deleting
    const docRef = doc(colRef, user_id)
    await deleteDoc(docRef).catch(err => {
        console.log(err)
        return result({res, msg: `Delete user ${user_id} failed`})
    })
    
    return result({res, msg: `Delete user ${user_id} successfully`})
}

// Routing

const routes = [
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path,
        handler: handlerGetUsers
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path + '/me',
        handler: handlerGetMyAccount
    },
    {
        method: FETCH_REQUEST_TYPES.GET,
        path: abs_path + '/{user_id}',
        handler: handlerGetUser
    },
    {
        method: FETCH_REQUEST_TYPES.POST,
        path: abs_path + '/register',
        handler: handlerRegister,
        options: {
            auth: false
        }
    },
    {
        method: FETCH_REQUEST_TYPES.POST,
        path: abs_path + '/login',
        handler: handlerLogin,
        options: {
            auth: false
        }
    },
    {
        method: FETCH_REQUEST_TYPES.PUT,
        path: abs_path + '/{user_id}',
        handler: handlerUpdateUser,
    },
    {
        method: FETCH_REQUEST_TYPES.DELETE,
        path: abs_path + '/{user_id}',
        handler: handlerDeleteUser,
    }
]

module.exports = routes
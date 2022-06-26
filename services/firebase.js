const { firebaseCredential } = require("../configs");
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require("firebase/firestore");

let firebaseApp = initializeApp(firebaseCredential)
let firestoreDB = getFirestore(firebaseApp)

// const getData = async () => {
//     const colRef = collection(firestoreDB, 'users_collection')
//     const users = await getDocs(colRef)
//     users.forEach(item => console.log(item.data()))
// }

// getData()

module.exports = {
    firebaseApp,
    firestoreDB
}

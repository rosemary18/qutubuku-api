const { getDoc, doc, collection } = require("firebase/firestore");
const { keys } = require("../../configs");
const { firestoreDB } = require('../firebase')
const colRef = collection(firestoreDB, 'users_collection')

const validate = async (artifacts, request, h) => {

    const docRef = doc(colRef, artifacts.decoded.payload.user.id)
    const user_data = await getDoc(docRef)
    const data = {...user_data.data()}
    
    if (Object.keys(data).length > 0) {
        return {
            isValid: true,
            credentials: { user: artifacts.decoded.payload.user }
        };
    } else {
        return {
            isValid: false
        }
    }

}

const jwtStrategy = (app) => {

    app.auth.strategy('jwt_token', 'jwt', {
        keys: keys.JWT_SECRET_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 86400, // 24 hours
            timeSkewSec: 15
        },
        validate: validate
    });

    app.auth.default('jwt_token');
}

module.exports = jwtStrategy
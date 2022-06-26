const {validator} = require('../types')
const dayjs = require('dayjs')
const types = {
    name: "", 
    gender: 0, 
    email: "", 
    password: "",
    avatar: "",
    address: "",
    mobile: "",
}

class CollectionUser {

    constructor({name, gender, email, avatar, password, address, mobile} = types) {

        this.name = validator.string(name)
        this.email = validator.string(email)
        this.avatar = validator.string(avatar)
        this.gender = validator.number(gender)
        this.password = validator.string(password)
        this.address = validator.string(address)
        this.mobile = validator.string(mobile)
        this.created_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.last_updated = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    toObject = () => {
        return {
            name: this.name,
            gender: this.gender,
            avatar: this.avatar,
            email: this.email,
            password: this.password,
            address: this.address,
            mobile: this.mobile,
            created_date: this.created_date,
            last_update: this.last_updated
        }
    }
}

module.exports = CollectionUser
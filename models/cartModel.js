const {validator} = require('../types')
const dayjs = require('dayjs')
const types = {
    user_id: "",
    product_id: "",
    quantity: "",
}

class CollectionCart {

    constructor({user_id, product_id, quantity} = types) {
        
        this.user_id = validator.string(user_id)
        this.product_id = validator.string(product_id)
        this.quantity = validator.number(quantity)
        this.created_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.last_updated = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    toObject = () => {
        return {
            user_id: this.user_id,
            product_id: this.product_id,
            quantity: this.quantity,
            created_date: this.created_date,
            last_update: this.last_updated
        }
    }
}

module.exports = CollectionCart
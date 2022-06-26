const {validator} = require('../types')
const dayjs = require('dayjs')
const { generateCode } = require('../utils')

const types = {
    order_id: "",
    user_id: "",
    product_id: "",
    quantity: 0,
    status: 0,
    shipping_type: 0
}

class CollectionOrder {
    
    constructor({user_id, product_id, quantity, status, total, changes, payment_method_id} = types) {

        this.user_id = validator.string(user_id)
        this.product_id = validator.string(product_id)
        this.quantity = validator.number(quantity)
        this.status = validator.number(status)
        this.shipping_type = validator.number(shipping_type)
        this.created_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.last_updated = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    toObject = () => {
        return {
            order_id: generateCode({prefix: "QID-"}),
            user_id: this.user_id,
            product_id: this.product_id,
            quantity: this.quantity,
            status: this.status,
            shipping_type: this.shipping_type,
            created_date: this.created_date,
            last_update: this.last_updated
        }
    }
}

module.exports = CollectionOrder
const {validator} = require('../types')
const dayjs = require('dayjs')
const { generateCode } = require('../utils')

const types = {
    invoice_id: "",
    order_id: "",
    user_id: "",
    product_id: "",
    quantity: 0,
    tax: 0,
    sub_total: 0,
    total: 0,
    changes: 0,
    payment_method_id: 0, 
}

class CollectionInvoice {
    
    constructor({user_id, order_id, product_id, quantity, tax, sub_total, total, changes, payment_method_id} = types) {

        this.order_id = validator.string(order_id)
        this.user_id = validator.string(user_id)
        this.product_id = validator.string(product_id)
        this.quantity = validator.number(quantity)
        this.tax = validator.number(tax)
        this.sub_total = validator.number(sub_total)
        this.total = validator.number(total)
        this.changes = validator.number(changes)
        this.payment_method_id = validator.number(payment_method_id)
        this.created_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.last_updated = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    toObject = () => {
        return {
            invoice_id: generateCode({prefix: "INV-"}),
            order_id: this.order_id,
            user_id: this.user_id,
            product_id: this.product_id,
            quantity: this.quantity,
            tax: this.tax,
            sub_total: this.sub_total,
            total: this.total,
            changes: this.changes,
            payment_method_id: this.payment_method_id,
            created_date: this.created_date,
            last_update: this.last_updated
        }
    }
}

module.exports = CollectionInvoice
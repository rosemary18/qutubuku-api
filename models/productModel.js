const {validator} = require('../types')
const dayjs = require('dayjs')
const types = {
    sku: "",
    name: "",
    description: "",
    stock: 0,
    photo: "http://localhost:7897/images/placeholder.png",
    stock_hold: 0,
    total_stock: 0,
    price: 0,
    unit: "pcs",
    categories: [],
    author: "",
}

class CollectionProduct {

    constructor({sku, name, description, photo, stock, stock_hold, total_stock, price, unit, categories, author, published_date} = types) {
        this.sku = validator.string(sku)
        this.name = validator.string(name)
        this.description = validator.string(description)
        this.author = validator.string(author)
        this.photo = photo ? validator.string(photo) : "http://localhost:7897/images/placeholder.png"
        this.stock = validator.number(parseFloat(stock))
        this.stock_hold = validator.number(parseFloat(stock_hold || 0))
        this.total_stock = total_stock ? validator.number(parseFloat(total_stock)) : this.stock
        this.price = validator.number(parseFloat(price))
        this.unit = unit ? validator.string(unit) : "pcs"
        this.categories = validator.array(categories)
        this.published_date = published_date ? (dayjs(published_date).format('YYYY-MM-DD')) : ""
        this.created_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.last_updated = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    toObject = () => {
        return {
            sku: this.sku,
            name: this.name,
            description: this.description,
            photo: this.photo,
            author: this.author,
            stock: this.stock,
            stock_hold: this.stock_hold,
            total_stock: this.total_stock,
            price: this.price,
            unit: this.unit,
            categories: this.categories,
            published_date: this.published_date,
            created_date: this.created_date,
            last_update: this.last_updated
        }
    }
}

module.exports = CollectionProduct
const {validator} = require('../types')
const dayjs = require('dayjs')
const { generateCode } = require('../utils')
const types = {
    name: ""
}

class CollectionCatalog {

    constructor({name} = types) {
        
        this.name = validator.string(name)
        this.created_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    toObject = () => {
        return {
            id: generateCode({prefix: "CAT-"}),
            name: this.name,
        }
    }
}

module.exports = CollectionCatalog
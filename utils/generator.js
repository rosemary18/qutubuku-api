const {validator} = require('../types')

const generateCode = ({prefix = "", length = 8}) => {

    const SOURCE_CHARS = "ABCDEFJHIJKLMNOPQRSTUVWXYZ0123456789:"
    let chars = validator.string(prefix)
    
    for(let i = 0; i < validator.number(length); i++) {
        chars += SOURCE_CHARS[Math.min(Math.floor(Math.random()*(SOURCE_CHARS.length-1)), (SOURCE_CHARS.length-1))]
    } 
    
    return chars
}

module.exports = {
    generateCode
}
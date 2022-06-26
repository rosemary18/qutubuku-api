const string = (value) => {
    if (typeof value === 'string') return value
    console.error(`"${value}" is not a string`)
    return ""
}

const object = (value) => {
    if (typeof value === 'object') return value
    console.error(`"${value}" is not an object`);
    return {}
}

const bool = (value) => {
    if (typeof value === 'boolean') return value
    console.error(`"${value}" is not a boolean`);
    return false
}

const number = (value) => {
    if (typeof value === 'number') return value
    console.error(`"${value}" is not a number`);
    return 0
}

const array = (value) => {
    if (value !== undefined && value?.length >= 0) return value
    console.error(`"${value}" is not an array`);
    return []
}

const nullish = (value) => {
    if (value !== undefined && value !== null) return value
    console.error(`"${value}" is a null or undefined`);
    return null
}

module.exports = {
    string,
    object,
    bool,
    number,
    array,
    nullish
}
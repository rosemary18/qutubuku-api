const result = ({res, data, status, msg, error_code, total, current_page, per_page, last_page}) => {

    const response = {}
    data && (response.data = data)
    msg && (response.message = msg)
    response.statusCode = status || 200
    error_code && (response.error_code = error_code)
    total && (response.total = total)
    current_page && (response.current_page = current_page)
    per_page && (response.per_page = per_page)
    last_page && (response.last_page = last_page)

    if (status) return res.response(response).code(status)
    return res.response(response)
}

module.exports = {
    result
}
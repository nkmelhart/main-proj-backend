class ErrorResponse extends Error {
    constructor(message, _statusCode) {
        super(message)
        this.statusCode = _statusCode
    }
}

module.exports = ErrorResponse
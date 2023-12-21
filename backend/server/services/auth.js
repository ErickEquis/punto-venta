
const jwt = require('jwt-simple')
const config = require('../config/config.json')
const secret = config.token_secret

function encodeAuth(user) {
    let token = jwt.encode(user, secret)
    return token
}

function decodeAuth(req) {
    let token = req.headers.authorization
    return jwt.decode(token, secret)
}

function ensureAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ mensaje: "Autenticación requerida." })
    }

    // let token = req.headers.authorization
    // let payload = jwt.decode(token, secret)
    // req.user = payload
    next()
}

module.exports = {
    encodeAuth,
    decodeAuth,
    ensureAuth,
}
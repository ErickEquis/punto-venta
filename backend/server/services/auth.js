
const jwt = require('jwt-simple')
const config = require('../config/config.json')
const moment = require('moment')
const secret = config.token_secret

function encodeAuth(user) {
    let payload = {
        "id": user.id,
        "rol": user.id_rol,
        "exp": moment().add(1, "day").unix()
    }
    let token = jwt.encode(payload, secret)

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

    try {
        decodeAuth(req)
    } catch (error) {
        return res.status(403).json({ mensaje: "Sesión expirada, por favor inicie de nuevo la sesión." })
    }

    next()
}

module.exports = {
    encodeAuth,
    decodeAuth,
    ensureAuth,
}
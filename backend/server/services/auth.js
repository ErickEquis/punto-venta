const jwt = require('jwt-simple')
const config = require('../config/config.json')
const moment = require('moment')
const secret = config.token_secret

function encodeAuth(payload) {

    let token = jwt.encode(payload, secret)

    return token
}

function decodeAuth(req) {

    let token = req.headers.authorization ? req.headers.authorization : req.query.token
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

function ensureAuthParam(req, res, next) {

    if (!req.query.token) {
        return res.status(401).json({ mensaje: "Autenticación requerida." })
    }

    try {
        decodeAuth(req)
    } catch (error) {
        return res.status(403).json({ mensaje: "Token expirado." })
    }

    next()
}

module.exports = {
    encodeAuth,
    decodeAuth,
    ensureAuth,
    ensureAuthParam,
}
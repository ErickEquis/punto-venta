'use strict'

const db = require('../models/index')
const op = db.sequelize.Op

// const model = require('../models/').ca_producto
const model = require('../models/').ca_producto

async function findAll(req, res) {
    try {

        console.log('model', model)

        let rows = await model.

        console.log('rows', rows)

        return res.status(200).send({rows: rows})

    } catch (error) {
        // console.error(error)
        return res.status(500).json({msg: error})
    }
}

async function create(req, res) {
    try {
        res.send("Ruta activa desde controlador.")
    } catch (error) {
        
    }
}
async function update(req, res) {
    try {
        res.send("Ruta activa desde controlador.")
    } catch (error) {
        
    }
}
async function remove(req, res) {
    try {
        res.send("Ruta activa desde controlador.")
    } catch (error) {
        
    }
}

module.exports = {
    findAll,
    create,
    update,
    remove
}
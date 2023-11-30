'use strict'

const db = require('../models/index')
const op = db.sequelize.Op

// const model = require('../models/').ca_producto
const model = require('../models/').ca_productos

async function findAll(req, res) {
    try {

        let clausula = {}

        clausula.descripcion = req.query.descripcion

        let rows = await model.findAll({
            // where: clausula
        })

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: error})
    }
}

async function findById(req, res) {
    try {

        let row = await model.findOne({
            where: {
                id: req.params.id
            }
        })

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: error})
    }
}

async function create(req, res) {
    try {

        console.log(req.body)

        console.log(model)

        let newProducto = await model.create({
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            estatus: true
        })

        return res.status(200).json({
            msg: "Producto creado con exito.",
            producto: newProducto
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: error})
    }
}
async function update(req, res) {
    try {

        await model.update({
            descripcion: req.body.descripcion,
            precio: req.body.precio
        },
        {where: {id: req.params.id}})

        res.status(200).json({
            msg: "Producto actualizado con exito.",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: error})
    }
}
async function remove(req, res) {
    try {

        await model.destroy({
            where: { id: req.params.id }
        })

        res.status(200).json({msg: "Producto eliminado con exito."})

    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: error})
    }
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
}
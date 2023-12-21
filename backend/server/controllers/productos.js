'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const model = require('../models/').ca_productos

const rules = require('../rules/productos')

async function findAll(req, res) {
    try {

        console.log(req.headers)

        req.query.descripcion ? req.query.descripcion : req.query.descripcion = '' 

        let rows = await model.findAll({
            where: {
                [op.or]: [
                    {
                        descripcion: { [op.iLike]: '%' + req.query.descripcion + '%' }
                    },
                    db.Sequelize.where(
                        db.Sequelize.fn('LOWER', db.Sequelize.fn('translate', db.Sequelize.col('descripcion'), 'áéíóúäëïöü', 'aeiouaeiou')),
                        {
                            [op.iLike]: '%' + req.query.descripcion + '%',
                        },
                    ),
                ],
            },
            raw: true,
        });

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: error})
    }
}

async function findById(req, res) {
    
    let json = {}
    
    try {

        let rule = rules.findById(req)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

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

    let json = {}

    try {

        let rule = rules.create(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.json(json)
        }

        await model.create({
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            cantidad: req.body.cantidad,
            estatus: true
        })

        json.mensaje = "Producto creado con éxito."

        return res.status(200).json(json)

    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: error})
    }
}

async function update(req, res) {

    let json = {}

    try {

        let rule = rules.update(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        await model.update({
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            cantidad: req.body.cantidad,
        },
        {where: {id: req.params.id}})

        json.mensaje = "Producto actualizado con exito."

        return res.status(200).json(json)
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: error})
    }
}

async function remove(req, res) {
    
    let json = {}
    
    try {

        let rule = rules.remove(req)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        await model.destroy({
            where: { id: req.params.id }
        })

        json.mensaje = "Producto eliminado con exito."

        res.status(200).json(json)

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
    remove,
}
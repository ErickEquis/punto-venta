'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const model = require('../models/').ca_productos

async function findAll(req, res) {
    try {

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

        await model.create({
            descripcion: req.body.descripcion,
            precio: parseInt(req.body.precio),
            cantidad: parseInt(req.body.cantidad),
            estatus: true
        })

        return res.status(200).json({ msg: "Producto creado con exito." })

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
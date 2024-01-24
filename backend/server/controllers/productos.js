'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const model = require('../models/').ca_productos

const rules = require('../rules/productos')

const auth = require('../services/auth')

async function findAll(req, res) {
    try {

        let usr = auth.decodeAuth(req)

        req.query.descripcion ? req.query.descripcion : req.query.descripcion = ''

        let rows = await model.findAll({
            where: {
                id_usuario: usr.id,
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
            order: [['descripcion', 'ASC']], 
            raw: true,
        });

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: error})
    }
}

async function findCodigo(req, res) {
    try {

        let usr = auth.decodeAuth(req)

        let row = await model.findOne({
            where: {
                id_usuario: usr.id,
                codigo: req.params.codigo
            },
            raw: true,
        })

        if (!row) {
            return res.status(400).json({ mensaje: "Producto no encontrado." })
        }

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }
}

async function findById(req, res) {
    
    let json = {}
    
    try {

        let usr = auth.decodeAuth(req)

        let rule = rules.findById(req)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        let row = await model.findOne({
            where: {
                id_usuario: usr.id,
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

        let usr = auth.decodeAuth(req)

        let rule = rules.create(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.json(json)
        }

        let existeProducto = await model.findOne({
            where: {
                id_usuario: usr.id,
                [op.or]: {
                    descripcion: req.body.descripcion,
                    codigo: req.body.codigo,
                }
            }
        })

        if (existeProducto) {
            return res.status(400).json({mensaje: "Lo sentimos, existe un producto con la misma descripcion y/o codigo."})
        }

        let transaction = await db.sequelize.transaction();

        let newProducto = await model.create({
            id_usuario: usr.id,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            cantidad: req.body.cantidad,
            codigo: req.body.codigo,
            estatus: true
        }, transaction)

        if (!newProducto) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible agregar el producto.',
            });
        }

        await transaction.commit();

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

        let usr = auth.decodeAuth(req)

        let rule = rules.update(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        let transaction = await db.sequelize.transaction()

        let updateProducto = await model.update({
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            cantidad: req.body.cantidad,
            codigo: req.body.codigo,
        },
            {
                where: {
                    id_usuario: usr.id,
                    id: req.params.id,
                }, transaction
            })

        if (!updateProducto) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible actualizar el producto.',
            });
        }

        await transaction.commit();

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

        let usr = auth.decodeAuth(req)

        let rule = rules.remove(req)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        let transaction = await db.sequelize.transaction()

        let deleteProducto = await model.destroy({
            where: {
                id_usuario: usr.id,
                id: req.params.id
            }, transaction
        })

        if (!deleteProducto) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible eliminar el producto.',
            });
        }

        await transaction.commit();

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
    findCodigo,
    create,
    update,
    remove,
}
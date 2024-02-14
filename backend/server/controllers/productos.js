'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op
const config = require('../config/config')

const ca_productos = require('../models/').ca_productos
const ca_notificaciones = require('../models/').ca_notificaciones

const rules = require('../rules/productos')

const auth = require('../services/auth')

async function findAll(req, res) {
    try {

        let usr = auth.decodeAuth(req)

        let clausula = {}

        if (req.query.descripcion) {
            clausula = {
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
            }
        }

        if (req.query.venta) {
            clausula.cantidad = { [op.gt]: 0 }
        }

        clausula.id_equipo = usr.equipo

        let rows = await ca_productos.findAll({
            where: clausula,
            order: [['descripcion', 'ASC']],
            raw: true,
        });

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }
}

async function findCodigo(req, res) {
    try {

        let usr = auth.decodeAuth(req)

        let row = await ca_productos.findOne({
            where: {
                id_equipo: usr.equipo,
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

        let row = await ca_productos.findOne({
            where: {
                id_equipo: usr.equipo,
                id: req.params.id,
                // cantidad: { [op.gt]: 0 }
            }
        })

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
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

        let existeProducto = await ca_productos.findOne({
            where: {
                id_equipo: usr.equipo,
                [op.or]: {
                    descripcion: req.body.descripcion,
                    codigo: req.body.codigo,
                }
            }
        })

        if (existeProducto) {
            return res.status(400).json({ mensaje: "Lo sentimos, existe un producto con la misma descripcion y/o codigo." })
        }

        let transaction = await db.sequelize.transaction();

        let newProducto = await ca_productos.create({
            id_equipo: usr.equipo,
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
        return res.status(500).json({ msg: error })
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

        let updateProducto = await ca_productos.update({
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            cantidad: req.body.cantidad,
            codigo: req.body.codigo,
        },
            {
                where: {
                    id_equipo: usr.equipo,
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
        return res.status(500).json({ msg: error })
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

        let deleteProducto = await ca_productos.destroy({
            where: {
                id_equipo: usr.equipo,
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
        return res.status(500).json({ msg: error })
    }
}

async function notificacionesInventario() {

    try {

        let id_equipos = await ca_productos.findAll({
            attributes: ['id_equipo'],
            group: ['id_equipo'],
            raw: true
        })

        let productos
        var arrNotificacion = []

        for (let i = 0; i < id_equipos.length; i++) {
            productos = await ca_productos.findAll({
                attributes: ['descripcion', 'cantidad'],
                where: {
                    id_equipo: id_equipos[i].id_equipo,
                    cantidad: {
                        [op.lt]: [10]
                    }
                },
                raw: true
            })
            if (productos.length != 0) {
                arrNotificacion.push(
                    {
                        id_equipo: id_equipos[i].id_equipo,
                        id_categoria: config.api.notifiaciones.categoria.inventario,
                        informacion: productos
                    }
                )
            }
        }

        let updateNotificacion
        let transaction = await db.sequelize.transaction()

        for (let j = 0; j < arrNotificacion.length; j++) {
            updateNotificacion = await ca_notificaciones.create({
                id_equipo: arrNotificacion[j].id_equipo,
                id_categoria: arrNotificacion[j].id_categoria,
                informacion: arrNotificacion[j].informacion
            }, transaction)

            if (!updateNotificacion) {
                await transaction.rollback();
                console.error('Error al enviar notificacion.')
                return
            }
        }

        await transaction.commit()

        console.log('Notificaciones enviadas.')

        return

    } catch (error) {
        console.error(error)
    }

}

module.exports = {
    findAll,
    findById,
    findCodigo,
    create,
    update,
    remove,
    notificacionesInventario,
}
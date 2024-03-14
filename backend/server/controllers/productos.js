'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op
const config = require('../config/config')

const ca_productos = require('../models/').ca_productos
const ca_notificaciones = require('../models/').ca_notificaciones

const rules = require('../rules/productos')

const auth = require('../services/auth')

const moment = require('moment')

async function findAll(req, res) {

    let transaction

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
        clausula.estatus = true

        transaction = await db.sequelize.transaction()

        let rows = await ca_productos.findAll({
            where: clausula,
            order: [['descripcion', 'ASC']],
            raw: true,
            transaction
        });

        await transaction.commit()

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

async function findCodigo(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let row = await ca_productos.findOne({
            where: {
                id_equipo: usr.equipo,
                codigo: req.params.codigo,
                estatus: true
            },
            raw: true,
            transaction
        })

        if (!row) {
            return res.status(400).json({ mensaje: "Producto no encontrado." })
        }

        await transaction.commit()

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

async function findById(req, res) {

    let json = {}
    let transaction

    try {

        let usr = auth.decodeAuth(req)

        let rule = rules.findById(req)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        transaction = await db.sequelize.transaction()

        let row = await ca_productos.findOne({
            where: {
                id_equipo: usr.equipo,
                id: req.params.id,
                cantidad: { [op.gt]: 0 },
                estatus: true,
            },
            transaction
        })

        await transaction.commit()

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

async function create(req, res) {

    let json = {}
    let transaction

    try {

        let usr = auth.decodeAuth(req)

        let rule = rules.create(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(400).json(json)
        }

        let clausula = {}

        if (req.body.codigo) {
            clausula = {
                [op.or]: {
                    descripcion: req.body.descripcion,
                    codigo: req.body.codigo,
                },
                id_equipo: usr.equipo,
                estatus: true
            }
        } else {
            clausula = {
                descripcion: req.body.descripcion,
                id_equipo: usr.equipo,
                estatus: true
            }
        }

        transaction = await db.sequelize.transaction()

        let existeProducto = await ca_productos.findOne({
            where: clausula,
            transaction
        })

        if (existeProducto) {
            return res.status(400).json({ mensaje: "Lo sentimos, existe un producto con la misma descripcion y/o codigo." })
        }

        // Si el producto tiene estatus = false, se reactiva.
        let is_disabled = await ca_productos.findOne({
            where: {
                id_equipo: usr.equipo,
                descripcion: req.body.descripcion,
                codigo: req.body.codigo,
                estatus: false,
            },
            raw: true,
            transaction
        })

        if (is_disabled) {

            let reactivar_producto = await ca_productos.update(
                {
                    cantidad: req.body.cantidad,
                    precio: req.body.precio,
                    estatus: true,
                    logical_delete: null
                },
                {
                    where: {
                        id: is_disabled.id,
                        id_equipo: usr.equipo,
                        descripcion: is_disabled.descripcion,
                        codigo: is_disabled.codigo,
                    },
                    transaction
                }
            )

            if (!reactivar_producto || reactivar_producto[0] != 1) {
                await transaction.rollback();
                return res.status(400).send({
                    mensaje: 'Lo sentimos, no fue posible agregar el producto.',
                });
            }

        } else {
            let newProducto = await ca_productos.create({
                id_equipo: usr.equipo,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                cantidad: req.body.cantidad,
                codigo: req.body.codigo,
                estatus: true
            }, { transaction })

            if (!newProducto) {
                await transaction.rollback();
                return res.status(400).send({
                    mensaje: 'Lo sentimos, no fue posible agregar el producto.',
                });
            }

        }

        await transaction.commit();

        json.mensaje = "Producto creado con éxito."

        return res.status(200).json(json)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

async function update(req, res) {

    let json = {}
    let transaction

    try {

        let usr = auth.decodeAuth(req)

        let rule = rules.update(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        transaction = await db.sequelize.transaction()

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
                    estatus: true,
                }, transaction
            })

        if (!updateProducto || updateProducto[0] != 1) {
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
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

// async function remove(req, res) {

//     let json = {}

//     try {

//         let usr = auth.decodeAuth(req)

//         let rule = rules.remove(req)
//         if (rule.codigo != 0) {
//             json.mensaje = rule.mensaje
//             return res.status(401).json(json)
//         }

//         let transaction = await db.sequelize.transaction()

//         let deleteProducto = await ca_productos.destroy({
//             where: {
//                 id_equipo: usr.equipo,
//                 id: req.params.id
//             }, transaction
//         })

//         if (!deleteProducto) {
//             await transaction.rollback();
//             return res.status(400).send({
//                 mensaje: 'Lo sentimos, no fue posible eliminar el producto.',
//             });
//         }

//         await transaction.commit();

//         json.mensaje = "Producto eliminado con exito."

//         res.status(200).json(json)

//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({ msg: error })
//     }
// }

async function notificacionesInventario() {

    let transaction

    try {

        let id_equipos = await ca_productos.findAll({
            attributes: ['id_equipo'],
            group: ['id_equipo'],
            raw: true
        })

        let productos
        var arrNotificacion = []

        transaction = await db.sequelize.transaction()

        for (let i = 0; i < id_equipos.length; i++) {
            productos = await ca_productos.findAll({
                attributes: ['descripcion', 'cantidad'],
                where: {
                    id_equipo: id_equipos[i].id_equipo,
                    cantidad: {
                        [op.lt]: [10]
                    }
                },
                raw: true,
                transaction
            })
            if (productos.length != 0) {
                arrNotificacion.push(
                    {
                        id_equipo: id_equipos[i].id_equipo,
                        id_categoria: config.api.notifiaciones.categoria.inventario,
                        data: productos,
                        descripcion: "Stock bajo",
                    }
                )
            }
        }

        let updateNotificacion

        for (let j = 0; j < arrNotificacion.length; j++) {
            updateNotificacion = await ca_notificaciones.create({
                id_equipo: arrNotificacion[j].id_equipo,
                id_categoria: arrNotificacion[j].id_categoria,
                data: arrNotificacion[j].data,
                descripcion: arrNotificacion[j].descripcion,
                fecha: moment().tz("America/Mexico_City")
            }, { transaction })

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
        await transaction.rollback()
        console.error(error)
    }

}

async function logicalDelete(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let producto = await ca_productos.findOne({
            attributes: ['estatus'],
            where: {
                id: req.params.id,
                id_equipo: usr.equipo
            },
            raw: true,
            transaction
        })

        if (!producto) {
            return res.status(400).json({ mensaje: 'No fue posible encontrar el producto.' })
        }

        let logicalProducto = await ca_productos.update(
            {
                estatus: !producto.estatus,
                logical_delete: moment().tz("America/Mexico_City")
            },
            {
                where: {
                    id: req.params.id,
                    id_equipo: usr.equipo
                },
                transaction
            }
        )

        if (!logicalProducto || logicalProducto[0] != 1) {
            await transaction.rollback()
            return res.status(400).json({ mensaje: 'No fue posible eliminar el producto.' })
        }

        await transaction.commit()

        return res.status(200).json({ mensaje: 'Producto eliminado.' })

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }

}

async function deleteProductos() {

    let transaction

    try {

        transaction = await db.sequelize.transaction()

        let productos = await ca_productos.findAll({
            attributes: ['id'],
            where: {
                logical_delete: moment().add(-7, 'days').tz("America/Mexico_City").format("YYYY-MM-DD"),
                estatus: false
            },
            raw: true,
            transaction
        })

        if (productos) {

            for (let i = 0; i < productos.length; i++) {
                let deleteProducto = await ca_productos.destroy({
                    where: {
                        id: productos[i].id
                    },
                    transaction
                })

                if (!deleteProducto) {
                    console.log(`El producto con id ${i} no pudo ser eliminado`)
                    await transaction.rollback()
                }
            }

        }

        console.log('Cron: Productos.')

        await transaction.commit()

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }

}

module.exports = {
    findAll,
    findById,
    findCodigo,
    create,
    update,
    // remove,
    notificacionesInventario,
    logicalDelete,
    deleteProductos
}
'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const ca_ventas = require('../models/').ca_ventas
const ca_historial_ventas = require('../models/').ca_historial_ventas
const ca_productos = require('../models/').ca_productos
const ca_usuarios = require('../models/').ca_usuarios

const rules = require('../rules/ventas')

const moment = require('moment')

const auth = require('../services/auth')
const config = require('../config/config')

async function findAll(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let rows = await ca_ventas.findAll(
            {
                attributes: { exclude: ['productos'] },
                where: {
                    id_equipo: usr.equipo
                },
                order: [['id', 'DESC']],
                raw: true,
                transaction
            }
        )

        if (!rows) {
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible obtner las ventas.',
            });
        }

        for (let i in rows) {
            rows[i].fecha_venta = moment(rows[i].fecha_venta).locale('es').format("DD MMM hh:mm a")
        }

        await transaction.commit()

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }

}

async function findTotal(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        if (usr.rol != config.api.rol.administrador) {
            return res.status(400).json({ mensaje: config.api.error_general })
        }

        transaction = await db.sequelize.transaction()

        let total = await ca_ventas.sum(
            'total_venta',
            {
                where: {
                    id_equipo: usr.equipo,
                    fecha_venta: {
                        [op.between]:
                            [
                                moment().tz("America/Mexico_City").format("YYYY-MM-DD"),
                                moment().add(1, 'day').tz("America/Mexico_City").format("YYYY-MM-DD")
                            ]
                    }
                }, transaction
            }
        )

        await transaction.commit()

        return res.status(200).json(total)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }

}

async function findMayorVendedores(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        if (usr.rol != config.api.rol.administrador) {
            return
        }

        transaction = await db.sequelize.transaction()

        let mayorVendedores = await ca_ventas.findAll(
            {
                attributes: [
                    'id_usuario',
                    [db.sequelize.fn('SUM', db.sequelize.col('total_venta')), 'total'],
                ],
                where: {
                    id_equipo: usr.equipo,
                    fecha_venta: {
                        [op.between]:
                            [
                                moment().tz("America/Mexico_City").format("YYYY-MM-DD"),
                                moment().add(1, 'day').tz("America/Mexico_City").format("YYYY-MM-DD")
                            ]
                    }
                },
                include: {
                    model: ca_usuarios,
                    as: 'usuario',
                    attributes: ['nombre'],
                },
                group: ['id_usuario', 'usuario.id'],
                order: [['total', 'DESC']],
                limit: req.query.limit,
                transaction
            }
        )

        let rows = mayorVendedores

        await transaction.commit()

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }

}

async function findById(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let row = await ca_ventas.findOne({
            where: {
                id: req.params.id,
                id_equipo: usr.equipo
            },
            raw: true,
            transaction
        })

        if (!row) {
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible obtener el registro de la venta.',
            });
        }

        for (let i = 0; i < row.productos.length; i++) {
            let stock = await ca_productos.findOne({
                attributes: ['cantidad'],
                where: {
                    id: row.productos[i].id,
                    id_equipo: usr.equipo
                },
                raw: true,
                transaction
            })

            row.productos[i].stock = stock ? stock.cantidad : 0

        }

        await transaction.commit()

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }

}

async function create(req, res) {

    let transaction

    try {
        let json = {}

        let usr = auth.decodeAuth(req)

        let rule = rules.create(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.json(json)
        }

        transaction = await db.sequelize.transaction()

        for (let a = 0; a < req.body.productos.length; a++) {
            let cantidadProductos = await ca_productos.findOne(
                {
                    where: {
                        id: req.body.productos[a].id,
                        id_equipo: usr.equipo
                    }, transaction
                }
            )

            if (!cantidadProductos) {
                return res.status(400).send({
                    mensaje: `Lo sentimos, el producto ${req.body.productos[a].descripcion} no se encuentra en inventario.`,
                });
            }

            if (cantidadProductos.cantidad < req.body.productos[a].cantidad) {
                return res.status(400).send({
                    mensaje: `Lo sentimos, el inventario no es suficiente para ${req.body.productos[a].descripcion}.`,
                });
            }
        }

        let newVenta = await ca_ventas.create({
            id_usuario: usr.id,
            id_equipo: usr.equipo,
            productos: req.body.productos,
            total_venta: req.body.total_venta,
            fecha_venta: moment()
        }, { transaction })

        if (!newVenta) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible registrar la venta.',
            });
        }

        for (let i = 0; i < req.body.productos.length; i++) {
            let cantidad = await ca_productos.increment(
                {
                    cantidad: (-req.body.productos[i].cantidad)
                },
                {
                    where: {
                        id: req.body.productos[i].id,
                        cantidad: { [op.gte]: req.body.productos[i].cantidad }
                    },
                    transaction
                },
            )
            console.log(cantidad[0][0][0].cantidad)
            if (cantidad[0][1] !== 1) {
                await transaction.rollback();
                return res.status(400).send({
                    mensaje: `Lo sentimos, el inventario no es suficiente para ${req.body.productos[i].descripcion}.`,
                });
            }
            if (cantidad[0][0][0].cantidad < 10) {
                
            }
        }

        await transaction.commit();

        return res.status(200).json({ mensaje: "Éxito." })

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }

}

async function update(req, res) {

    let transaction

    try {

        let json = {}

        let usr = auth.decodeAuth(req)

        let rule = rules.update(req)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(400).json(json)
        }

        let venta = await ca_ventas.findOne({
            where: {
                id: req.params.id,
                id_equipo: usr.equipo
            },
            raw: true
        })

        if (!venta) {
            return res.status(400).json({ mensaje: "No se encontró la venta." })
        }

        if (JSON.stringify(venta.productos) == JSON.stringify(req.body.productos)) {
            return res.status(400).json({ mensaje: "No hay ninguna modificacion en la venta." })
        }

        let modInventario = []

        for (let i = 0; i < req.body.productos.length; i++) {
            let v = venta.productos.find((producto) => req.body.productos[i].descripcion == producto.descripcion)

            if (v) {
                modInventario.push(
                    {
                        descripcion: req.body.productos[i].descripcion,
                        cantidad: (v.cantidad - req.body.productos[i].cantidad)
                    }
                )
            }

            if (req.body.productos[i].cantidad == 0) {
                req.body.productos.splice(i, 1)
            }

            if (!v) {
                modInventario.push(
                    {
                        descripcion: req.body.productos[i].descripcion,
                        cantidad: req.body.productos[i].cantidad
                    }
                )
            }
        }

        transaction = await db.sequelize.transaction();

        let newVentaMod = await ca_historial_ventas.create({
            id_modificado: venta.id,
            id_usuario_modifica: usr.id,
            productos: req.body.productos,
            productos_modificados: venta.productos,
            total_venta: req.body.total_venta,
            total_venta_modificado: venta.total_venta,
            fecha_modificacion: moment(),
            fecha_venta_modificada: venta.fecha_venta
        }, { transaction })

        if (!newVentaMod) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible registrar la venta.',
            });
        }

        let updateVenta = await ca_ventas.update({
            productos: req.body.productos,
            total_venta: req.body.total_venta,
            modificado: true,
            id_modificado: parseInt(newVentaMod["dataValues"].id),
        }, {
            where: {
                id_equipo: usr.equipo,
                id: req.params.id
            },
            transaction
        })

        if (!updateVenta || updateVenta[0] !== 1) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible actualizar la venta.',
            });
        }

        for (let j = 0; j < modInventario.length; j++) {
            let updateInventario = await ca_productos.increment(
                {
                    cantidad: (modInventario[j].cantidad)
                },
                {
                    where: {
                        id_equipo: usr.equipo,
                        descripcion: modInventario[j].descripcion,
                    },
                    transaction
                },
            )

            if (!updateInventario || updateInventario[0][1] !== 1) {
                await transaction.rollback();
                return res.status(400).send({
                    mensaje: 'Lo sentimos, no fue posible actualizar la venta.',
                });
            }
        }

        await transaction.commit()

        return res.status(200).json({ mensaje: "Venta actualizada con éxito." })

    } catch (error) {
        console.error(error)
        await transaction.rollback();
        return res.status(500).json({ msg: error })
    }

}

async function remove(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        if (usr.rol != config.api.rol.administrador) {
            return res.status(401).json({ mensaje: config.api.error_general })
        }

        transaction = await db.sequelize.transaction()

        let producto = await ca_ventas.findOne({
            attributes: ['id', 'productos'],
            where: {
                id: req.params.id,
                id_equipo: usr.equipo,
            },
            raw: true,
            transaction
        })

        for (let i = 0; i < producto.length; i++) {
            let cantidad = await ca_productos.increment(
                {
                    cantidad: producto[i].cantidad
                },
                {
                    where: {
                        id: producto.id,
                    },
                    transaction
                },
            )

            if (!cantidad || cantidad[0][1] !== 1) {
                await transaction.rollback()
                return res.status(400).json({ mensaje: "No fue posible actualizar el inventario." })
            }

        }

        let row = await ca_ventas.destroy({
            where: {
                id: req.params.id,
                id_equipo: usr.equipo
            }
        }, { transaction })

        if (!row || row[0][1] !== 1) {
            await transaction.rollback()
            return res.status(400).json({ mensaje: "No fue posible eliminar el registro de la venta" })
        }

        await transaction.commit()

        return res.status(200).json({ mensaje: "Registro de venta eliminado." })

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }

}

async function historialVentas(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let rows = await ca_historial_ventas.findAll({
            where: {
                id_modificado: req.params.id,
            },
            include: {
                model: ca_usuarios,
                attributes: ['nombre']
            },
            order: [['fecha_modificacion', 'DESC']],
            transaction
        })

        await transaction.commit()

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }

}

module.exports = {
    findAll,
    findById,
    findTotal,
    findMayorVendedores,
    create,
    update,
    remove,
    historialVentas,
}
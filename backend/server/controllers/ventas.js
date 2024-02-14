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

    try {

        let usr = auth.decodeAuth(req)

        let rows = await ca_ventas.findAll(
            {
                attributes: { exclude: ['productos'] },
                where: {
                    id_equipo: usr.equipo
                },
                order: [['id', 'DESC']],
                raw: true,
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

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }

}

async function findTotal(req, res) {

    try {

        let usr = auth.decodeAuth(req)

        if (usr.rol != config.api.rol.administrador) {
            return res.status(400).json({mensaje: config.api.error_general})
        }

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
                },
            }
        )

        return res.status(200).json(total)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }

}

async function findMayorVendedores(req, res) {

    try {

        let usr = auth.decodeAuth(req)

        if (usr.rol != config.api.rol.administrador) {
            return
        }

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
            }
        )

        let rows = mayorVendedores

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }

}

async function findById(req, res) {

    try {

        let usr = auth.decodeAuth(req)

        let row = await ca_ventas.findOne({
            where: {
                id: req.params.id
            },
            raw: true
        })

        if (!row) {
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible obtener el registro de la venta.',
            });
        }

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }

}

async function create(req, res) {

    try {
        let json = {}

        let usr = auth.decodeAuth(req)

        let rule = rules.create(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.json(json)
        }

        for (let a = 0; a < req.body.productos.length; a++) {
            let cantidadProductos = await ca_productos.findOne(
                {
                    where: {
                        id: req.body.productos[a].id,
                        id_equipo: usr.equipo
                    }
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

        let transaction = await db.sequelize.transaction()

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
                    }
                }, transaction
            )
            if (cantidad[0][1] !== 1) {
                await transaction.rollback();
                return res.status(400).send({
                    mensaje: `Lo sentimos, el inventario no es suficiente para ${req.body.productos[i].descripcion}.`,
                });
            }
        }

        await transaction.commit();

        return res.status(200).json({ mensaje: "Éxito." })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }

}

async function update(req, res) {

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

            if (!v) {
                modInventario.push(
                    {
                        descripcion: req.body.productos[i].descripcion,
                        cantidad: req.body.productos[i].cantidad
                    }
                )
            }
        }

        let transactionHistorial = await db.sequelize.transaction()

        let newVentaMod = await ca_historial_ventas.create({
            id_modificado: venta.id,
            id_usuario_modifica: usr.id,
            productos: req.body.productos,
            productos_modificados: venta.productos,
            total_venta: req.body.total_venta,
            total_venta_modificado: venta.total_venta,
            fecha_modificacion: moment(),
            fecha_venta_modificada: venta.fecha_venta
        }, { transactionHistorial })

        if (!newVentaMod) {
            await transactionHistorial.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible registrar la venta.',
            });
        }

        await transactionHistorial.commit();

        let transactionUpdate = await db.sequelize.transaction()

        console.log(req.body.productos)

        let updateVenta = await ca_ventas.update({
            productos: req.body.productos,
            total_venta: req.body.total_venta,
            modificado: true,
            id_modificado: newVentaMod["dataValues"].id,
        }, {
            where: {
                id_usuario: usr.id,
                id: req.params.id
            }
        }, { transactionUpdate })

        if (!updateVenta) {
            await transactionUpdate.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible actualizar la venta.',
            });
        }

        await transactionUpdate.commit()

        let transactionInventario = await db.sequelize.transaction()

        for (let j = 0; j < modInventario.length; j++) {
            let updateInventario = await ca_productos.increment(
                {
                    cantidad: (modInventario[j].cantidad)
                },
                {
                    where: {
                        id_equipo: usr.equipo,
                        descripcion: modInventario[j].descripcion,
                    }
                }, transactionInventario
            )

            if (!updateInventario) {
                await transactionUpdate.rollback();
                return res.status(400).send({
                    mensaje: 'Lo sentimos, no fue posible actualizar la venta.',
                });
            }
        }

        await transactionInventario.commit()

        return res.status(200).json({ mensaje: "Venta actualizada con éxito." })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }

}

async function remove(req, res) {

    try {

        let usr = auth.decodeAuth(req)

        if (usr.rol != config.api.rol.administrador) {
            return res.status(401).json({ mensaje: config.api.error_general })
        }

        let transaction = await db.sequelize.transaction()

        let row = await ca_ventas.destroy({
            where: {
                id: req.params.id,
                id_equipo: usr.equipo
            }
        }, { transaction })

        if (!row) {
            await transaction.rollback()
            return res.status(400).json({ mensaje: "No fue posible eliminar el registro de la venta" })
        }

        await transaction.commit()

        return res.status(200).json({ mensaje: "Registro de venta eliminado." })

    } catch (error) {
        console.error(error)
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
}
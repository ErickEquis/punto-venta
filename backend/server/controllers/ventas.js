'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const ca_ventas = require('../models/').ca_ventas
const ca_ventas_historial = require('../models/').ca_ventas_historial
const ca_productos = require('../models/').ca_productos

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
            return
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

        for (let a = 0; a < req.body.productos.length; a++) {
            let cantidadProductos = await ca_productos.findOne(
                {
                    where: {
                        id: req.body.productos[i].id,
                        id_equipo: usr.equipo
                    }
                }
            )

            if (cantidadProductos.cantidad < req.body.productos[a].cantidad) {
                await transaction.rollback();
                return res.status(400).send({
                    mensaje: `Lo sentimos, el inventario no es suficiente para ${req.body.productos[a].descripcion}.`,
                });
            }
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

        let usr = auth.decodeAuth(req)

        let rule = rules.create(req)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.json(json)
        }

        let venta = await ca_ventas.findOne({
            where: {
                id: req.param.id,
                id_equipo: usr.equipo
            }
        })

        if (!venta) {
            return res.status(400).json({ mensaje: "No existe esta venta." })
        }

        let transaction = await db.sequelize.transaction()

        let updateVenta = await ca_ventas.update({
            productos: req.body.productos,
            total_venta: req.body.total_venta,
            fecha_venta: moment(),
            modificado: true
        }, {
            where: {
                id_usuario: usr.id,
                id: req.params.id
            }
        }, { transaction })

        if (!updateVenta) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible actualizar la venta.',
            });
        }

        let newVentaMod = await ca_ventas_historial.create({
            id_modificado: venta.id,
            id_usuario_modifica: usr.id,
            productos: req.body.productos,
            productos_modificados: venta.productos,
            total_venta: req.body.total_venta,
            total_venta_modificado: venta.total_venta,
            fecha_venta: moment(),
            fecha_venta_modificada: venta.fecha_venta
        }, { transaction })

        if (!newVentaMod) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible registrar la venta.',
            });
        }

        await transaction.commit();

        return res.status(200).json({ mensaje: "Éxito." })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }

}

async function remove(req, res) {

    try {

        let usr = auth.decodeAuth(req)

        if (usr.id != config.api.rol.administrador) {
            return res.status(401).json({ mensaje: config.api.error_general })
        }

        let transaction = await db.sequelize.transaction()

        let row = await ca_ventas.destroyer({
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
    create,
    update,
    remove,
}
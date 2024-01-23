'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const ca_ventas = require('../models/').ca_ventas
const ca_ventas_historial = require('../models/').ca_ventas_historial

const rules = require('../rules/ventas')

const moment = require('moment')

const auth = require('../services/auth')

async function findAll(req, res) {

    try {

        let usr = auth.decodeAuth(req)

        let rows = await ca_ventas.findAll(
            {
                attributes: { exclude: ['productos'] },
                order: [['id', 'ASC']],
                raw: true,
            }
        )

        if (!rows) {
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible obtner las ventas.',
            });
        }

        for (let i in rows) {
            rows[i].fecha_venta = moment(rows[i].fecha_venta).locale('es').format("DD MMM HH:MM", 'mx')
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

        let total = await ca_ventas.sum(
            'total_venta',
            {
                where: {
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
                mensaje: 'Lo sentimos, no fue posible obtner las ventas.',
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
            where: { id: req.param.id }
        })

        if (!venta) {
            return res.status(400).json({ mensaje: "No existe venta." })
        }

        let transaction = await db.sequelize.transaction()

        let updateVenta = await ca_ventas.update({
            productos: req.body.productos[0],
            total_venta: req.body.total_venta,
            fecha_venta: moment()
        }, {
            where: {
                id: req.param.id
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
            productos: req.body.productos[0],
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

        let transaction = await db.sequelize.transaction()

        let row = await ca_ventas.destroyer({
            where: {
                id: req.params.id
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
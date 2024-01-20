'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const ca_ventas = require('../models/').ca_ventas

const rules = require('../rules/ventas')

const moment = require('moment')

const auth = require('../services/auth')

async function create(req, res) {

    try {

        let usr = auth.decodeAuth(req)

        let rule = rules.create(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.json(json)
        }

        let transaction = await db.sequelize.transaction()

        let newVenta = await ca_ventas.create({
            id_usuario: usr.id,
            productos: req.body.productos[0],
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

module.exports = {
    create,
}
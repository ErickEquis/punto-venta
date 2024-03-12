'use strict'

const ca_notificaciones = require('../models').ca_notificaciones
const ca_categoria_notificaciones = require('../models').ca_categoria_notificaciones

const db = require('../models')
const auth = require('../services/auth')

const moment = require('moment')

async function getNotificaciones(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let rows = await ca_notificaciones.findAll({
            where: {
                id_equipo: usr.equipo
            },
            include: {
                model: ca_categoria_notificaciones,
                as: 'categoria',
                attributes: ['descripcion']
            },
            raw: true,
            transaction
        })

        for (let i = 0; i < rows.length; i++) {
            rows[i].fecha = moment(rows[i].fecha).locale('es').format("DD MMMM")
        }

        await transaction.commit()

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json(error)
    }

}

async function countNotificaciones(req, res) {

    let transaction

    try {
        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let row = await ca_notificaciones.count({
            where: {
                id_equipo: usr.equipo
            },
            transaction
        })

        await transaction.commit()

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json(error)
    }

}

async function remove(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let eliminarNotificacion = await ca_notificaciones.destroy({
            where: {
                id: req.params.id,
                id_equipo: usr.equipo
            }, transaction
        })

        if (!eliminarNotificacion) {
            await transaction.rollback()
            return res.status(400).json({ mensaje: "Ocurrio un error al eliminar la notificación." })
        }

        await transaction.commit()

        return res.status(200).json({ mensaje: "Notificación eliminada." })

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json(error)
    }

}

module.exports = {
    getNotificaciones,
    countNotificaciones,
    remove,
}
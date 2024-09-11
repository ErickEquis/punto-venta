'use strict'

const db = require('../models/sql')
const op = db.Sequelize.Op
const auth = require('../services/auth')
const config = require('../config/config')

const ca_notificaciones = require('../models/sql').ca_notificaciones
const ca_categoria_notificaciones = require('../models/sql').ca_categoria_notificaciones
const ca_productos = require('../models/sql').ca_productos

const moment = require('moment')
const moment_tz = moment().tz(config.api.timezone)
const moment_iso8601 = moment().tz(config.api.timezone, moment.ISO_8601).toISOString(true)

async function getNotificaciones(req, res) {

    try {

        let usr = auth.decodeAuth(req)

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
        })

        for (let i = 0; i < rows.length; i++) {
            rows[i].fecha = moment(rows[i].fecha).locale('es').format("DD MMMM")
        }

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }

}

async function countNotificaciones(req, res) {

    let transaction

    try {
        let usr = auth.decodeAuth(req)

        let row = await ca_notificaciones.count({
            where: {
                id_equipo: usr.equipo
            },
        })

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
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

        transaction = await db.sequelize.transaction()

        for (let j = 0; j < arrNotificacion.length; j++) {
            updateNotificacion = await ca_notificaciones.create({
                id_equipo: arrNotificacion[j].id_equipo,
                id_categoria: arrNotificacion[j].id_categoria,
                data: arrNotificacion[j].data,
                descripcion: arrNotificacion[j].descripcion,
                fecha: moment_tz
            }, { transaction })

            if (!updateNotificacion) {
                await transaction.rollback();
                console.error('Error al enviar notificacion.')
                return
            }
        }

        await transaction.commit()

        console.log('Notificaciones enviadas.')

    } catch (error) {
        console.error(error)
        await transaction.rollback()
    }

}

module.exports = {
    getNotificaciones,
    countNotificaciones,
    remove,
    notificacionesInventario
}
'use strict'

const ca_notificaciones = require('../models').ca_notificaciones
const ca_categoria_notificaciones = require('../models').ca_categoria_notificaciones

const auth = require('../services/auth')

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
            }
        })

        return res.status(200).json(rows)

    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }

}

async function countNotificaciones(req, res) {

    try {

        let usr = auth.decodeAuth(req)

        let row = await ca_notificaciones.count({
            where: {
                id_equipo: usr.equipo
            }
        })

        return res.status(200).json(row)
        
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
    
}

module.exports = {
    getNotificaciones,
    countNotificaciones,
}
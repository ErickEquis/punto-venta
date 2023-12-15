'use strict'

const { where } = require('sequelize')
const db = require('../models/index')
const op = db.Sequelize.Op

const model = require('../models/').ca_usuarios
const ca_roles = require('../models/').ca_roles

const rules = require('../rules/usuarios')

async function createSesion(req, res) {

    let json = {}

    try {

        let rule = rules.createSesion(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        let row = await model.findOne({
            where: {
                nombre: req.body.nombre,
                contrasenia: req.body.contrasenia,
            }
        })

        if (!row) {
            return res.status(401).json({ mensaje: "Usuario no encontrado." })
        }

        return res.status(200).json(row)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }
}

async function findAll(req, res) {
    try {

        let users = await model.findAll({
            include: {
                model: ca_roles,
                attributes: ['descripcion']
            }
            , raw: true
        },
        )

        return res.status(200).json(users)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }
}

async function create(req, res) {

    let json = {}

    try {

        let rule = rules.create(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.json(json)
        }

        await model.create({
            nombre: req.body.nombre,
            contrasenia: req.body.contrasenia,
            correo: req.body.correo,
            rol: 1,
            estatus: true
        })

        json.mensaje = "Usuario creado con éxito."

        return res.status(200).json(json)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }
}

async function update(req, res) {

    let json = {}

    try {

        let rule = rules.update(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        await model.update({
            nombre: req.body.nombre,
            contrasenia: req.body.contrasenia,
            correo: req.body.correo,
        },
            { where: { id: req.params.id } })

        json.mensaje = "Usuario actualizado con exito."

        return res.status(200).json(json)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }
}

async function remove(req, res) {

    let json = {}

    try {

        let rule = rules.remove(req)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        await model.destroy({
            where: { id: req.params.id }
        })

        json.mensaje = "Usuario eliminado con exito."

        res.status(200).json(json)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }
}

module.exports = {
    findAll,
    createSesion,
    create,
    update,
    remove,
}
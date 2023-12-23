'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const model = require('../models/').ca_usuarios
const ca_roles = require('../models/').ca_roles

const rules = require('../rules/usuarios')

const moment = require('moment')

const auth = require('../services/auth')

async function crearSesion(req, res) {

    let json = {}

    try {

        let rule = rules.createSesion(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        let user = await model.findOne({
            attributes: ['nombre', 'id_rol', 'estatus'],
            where: {
                correo: req.body.correo,
                contrasenia: req.body.contrasenia,
                estatus: true
            },
            include: {
                model: ca_roles,
                attributes: ['permisos']
            },
            raw: true
        })

        if (!user) {
            return res.status(401).json({ mensaje: "La contraseña y/o correo son incorrectos." })
        }

        if (!user.estatus) {
            return res.status(401).json({ mensaje: "Usuario no valido." })
        }

        let permisos = []

        for (let i in user['ca_role.permisos']) {
            permisos.push(
                {
                    acceso: i,
                    slug: user['ca_role.permisos'][i]['slug']
                }
            )
        }

        await model.update(
            { ultimo_acceso: moment.tz("America/Mexico_City") },
            {
                where: {
                    correo: req.body.correo,
                    contrasenia: req.body.contrasenia,
                },
            }
        )

        let response ={
            token: auth.encodeAuth(user),
            nombre: user.nombre,
            rol: user.id_rol,
            permisos: permisos,
        }

        return res.status(200).json(response)

    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

async function findAll(req, res) {
    try {

        let users = await model.findAll({
            include: {
                model: ca_roles,
                attributes: ['descripcion']
            },
            raw: true
        },
        )

        return res.status(200).json(users)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }
}

async function findById(req, res) {
    try {

        let user = await model.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: ca_roles,
                attributes: ['descripcion']
            }
            , raw: true
        },
        )

        return res.status(200).json(user)

    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
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

        let repeat = await model.findOne({
            where: {
                correo: req.body.correo,
            }
        })

        if (repeat) {
            return res.status(401).json({ mensaje: 'Ya existe un usuario con el correo proporcionado.' })
        }

        await model.create({
            nombre: req.body.nombre,
            contrasenia: req.body.contrasenia,
            correo: req.body.correo,
            id_rol: 10,
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
        return res.status(500).json(error)
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
    findById,
    crearSesion,
    create,
    update,
    remove,
}
'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const model = require('../models/').ca_usuarios
const ca_roles = require('../models/').ca_roles

const rules = require('../rules/usuarios')

const jwt = require('jwt-simple')
const moment = require('moment')

async function crearSesion(req, res) {

    let json = {}

    try {

        let rule = rules.createSesion(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        let user = await model.findOne({
            attributes: ['nombre', 'id_rol'],
            where: {
                correo: req.body.correo,
                contrasenia: req.body.contrasenia,
            }
        })

        if (!user) {
            return res.status(401).json({ mensaje: "La contraseña y/o correo son incorrectos." })
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

        let token = jwt.encode(user, 'terry')

        let response ={
            token: token,
            nombre: user.nombre,
            rol: user.id_rol,
        }

        return res.status(200).json(response)

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


        console.log('row', user)
        let token = jwt.encode(user, 'terry')
        console.log(token)
        token = jwt.decode(token, 'terry')
        console.log(token)

        return res.status(200).json(user)

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
    findById,
    crearSesion,
    create,
    update,
    remove,
}
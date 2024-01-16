'use strict'

const db = require('../models/index')
const op = db.Sequelize.Op

const model = require('../models/').ca_usuarios
const ca_roles = require('../models/').ca_roles

const rules = require('../rules/usuarios')

const moment = require('moment')

const auth = require('../services/auth')
const mail = require('../services/mail')

async function crearSesion(req, res) {

    let json = {}

    try {

        let rule = rules.createSesion(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        let user = await model.findOne({
            attributes: ['id', 'nombre', 'id_rol', 'estatus'],
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

        let transaction = await db.sequelize.transaction()

        let updateAcceso = await model.update(
            { ultimo_acceso: moment.tz("America/Mexico_City") },
            {
                where: {
                    correo: req.body.correo,
                    contrasenia: req.body.contrasenia,
                }, transaction
            }
        )

        if (!updateAcceso) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible iniciar sesión.',
            });
        }

        await transaction.commit();

        let payload = {
            "id": user.id,
            "rol": user.id_rol,
            "exp": moment().add(1, "day").unix()
        }

        let response ={
            token: auth.encodeAuth(payload),
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

async function restorePwd(req, res) {
    try {

        let usr = auth.decodeAuth(req)

        let transaction = await db.sequelize.transaction()

        let updatePwd = await model.update(
            {
                contrasenia: req.body.contrasenia
            },
            {
                where: {
                    nombre: usr.nombre,
                    correo: usr.correo,
                }
            }, transaction
        )

        if (!updatePwd) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible actualizar la contraseña.',
            });
        }

        await transaction.commit()

        return res.status(200).json({mensaje: "Éxito."})

    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

async function forgotPwd(req, res) {
    try {

        let user = await model.findOne({
            where: {
                correo: req.body.correo
            }
        })

        let payload = {
            "nombre": user.nombre,
            "correo": user.correo,
            "exp": moment().add(15, "minutes").unix()
        }

        let token = auth.encodeAuth(payload)

        // console.log(token)

        // let send = await mail.mail()
        // console.log(send)

        return res.status(200).json({mensaje: "Éxito."})

    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

async function findAll(req, res) {
    try {

        let usr = auth.decodeAuth(req)

        let users = await model.findAll({
            where: {
                equipo: usr.id
            },
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

        let transaction = await db.sequelize.transaction()

        let newUsuario = await model.create({
            nombre: req.body.nombre,
            contrasenia: req.body.contrasenia,
            correo: req.body.correo,
            id_rol: 10,
            estatus: true
        }, transaction)

        if (!newUsuario) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible agregar al usuario.',
            });
        }

        await transaction.commit();

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

        let transaction = await db.sequelize.transaction()

        let updateUsuario = await model.update({
            nombre: req.body.nombre,
            contrasenia: req.body.contrasenia,
            correo: req.body.correo,
        },
            { where: { id: req.params.id }, transaction })

        if (!updateUsuario) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible actualizar al usuario.',
            });
        }

        await transaction.commit();

        json.mensaje = "Usuario actualizado con exito."

        return res.status(200).json(json)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error)
    }
}

async function remove(req, res) {

    let json = {}
    let transaction = null

    try {

        let usr = auth.decodeAuth(req)
        if (usr.rol != 10) {
            return res.status(400).send({
                mensaje: 'Lo sentimos, no tiene autorización para esta acción.',
            });
        }

        let rule = rules.remove(req)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        transaction = await db.sequelize.transaction();

        let deleteUsuario = await model.destroy({
            where: {
                id: req.params.id,
                equipo: usr.id
            }, transaction
        })

        if (!deleteUsuario) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible eliminar al usuario.',
            });
        }

        await transaction.commit()

        json.mensaje = "Usuario eliminado con exito."

        res.status(200).json(json)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: error })
    }
}

module.exports = {
    crearSesion,
    restorePwd,
    forgotPwd,
    findAll,
    findById,
    create,
    update,
    remove,
}
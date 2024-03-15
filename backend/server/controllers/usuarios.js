'use strict'

const config = require('../config/config')

const db = require('../models/index')
const op = db.Sequelize.Op

const ca_usuarios = require('../models/').ca_usuarios
const ca_roles = require('../models/').ca_roles
const ca_equipos = require('../models/').ca_equipos

const rules = require('../rules/usuarios')

const moment = require('moment')

const auth = require('../services/auth')
const mail = require('../services/mail')

async function crearSesion(req, res) {

    let json = {}
    let transaction

    try {

        let rule = rules.createSesion(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        transaction = await db.sequelize.transaction()

        let user = await ca_usuarios.findOne({
            attributes: ['id', 'id_rol', 'id_equipo', 'nombre', 'estatus'],
            where: {
                correo: req.body.correo,
                contrasenia: req.body.contrasenia,
                estatus: true
            },
            include: {
                model: ca_roles,
                attributes: ['permisos']
            },
            raw: true,
            transaction
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
                    slug: user['ca_role.permisos'][i]['slug'],
                    icon: user['ca_role.permisos'][i]['icon'],
                }
            )
        }

        let updateAcceso = await ca_usuarios.update(
            { ultimo_acceso: moment.tz("America/Mexico_City") },
            {
                where: {
                    correo: req.body.correo,
                    contrasenia: req.body.contrasenia,
                }, transaction
            }
        )

        if (!updateAcceso || updateAcceso[0] != 1) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible iniciar sesión.',
            });
        }

        await transaction.commit();

        let payload = {
            "id": user.id,
            "rol": user.id_rol,
            "equipo": user.id_equipo,
            "exp": moment().add(1, "day").unix(),
        }

        let response = {
            token: auth.encodeAuth(payload),
            nombre: user.nombre,
            rol: user.id_rol,
            permisos: permisos,
            equipo: user.id_equipo
        }

        return res.status(200).json(response)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json(error)
    }
}

async function restorePwd(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        let transaction = await db.sequelize.transaction()

        let user = await ca_usuarios.findOne({
            where: {
                nombre: usr.nombre,
                correo: usr.correo
            }, transaction
        })

        if (!user) {
            return res.status(400).json({ mensaje: "Usuario no encontrado." })
        }
        if (usr.nombre != user.nombre || usr.correo != user.correo) {
            return res.status(400).json({ mensaje: "Usuario no encontrado." })
        }

        let updatePwd = await ca_usuarios.update(
            {
                contrasenia: req.body.contrasenia
            },
            {
                where: {
                    nombre: usr.nombre,
                    correo: usr.correo,
                },
                transaction
            }
        )

        if (!updatePwd || updatePwd[0] != 1) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible actualizar la contraseña.',
            });
        }

        await transaction.commit()

        return res.status(200).json({ mensaje: "Contraseña restaurada." })

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json(error)
    }
}

async function forgotPwd(req, res) {

    let transaction

    try {

        transaction = await db.sequelize.transaction()

        let user = await ca_usuarios.findOne({
            where: {
                correo: req.body.correo
            },
            transaction
        })

        if (!user) {
            return res.status(400).json({ mensaje: "Error." })
        }

        let payload = {
            "nombre": user.nombre,
            "correo": user.correo,
            "exp": moment().add(30, "minutes").unix()
        }

        let token = auth.encodeAuth(payload)

        let data = {
            correo: req.body.correo,
            subject: "Restaurar contraseña.",
            token: token,
            option: 2
        }

        let send = await mail.sendMail(data)

        if (send.status != 200) {
            return res.status(400).json({ mensaje: "No fue posible enviar el correo." })
        }

        await transaction.commit()

        return res.status(200).json({ mensaje: "Revisa tu correo electronico para restaurar tu contraseña." })

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json(error)
    }
}

async function newMemberToken(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        if (usr.rol != 10) {
            return res.status(400).json({ mensaje: config.api.error_general })
        }

        transaction = await db.sequelize.transaction()

        let member = await ca_usuarios.findOne({
            where: {
                correo: req.body.correo
            },
            raw: true,
            transaction
        })

        if (member) {
            return res.status(400).json({ mensaje: "El usuario ya se encuentra registrado." })
        }

        let user = await ca_usuarios.findOne({
            attributes: ['nombre'],
            where: {
                id: usr.id,
            },
            include: {
                model: ca_equipos,
                attributes: ['nombre']
            },
            transaction
        })


        let payload = {
            "equipo": usr.equipo,
            "is_admin": false,
            "exp": moment().add(30, "minutes").unix()
        }

        let token = auth.encodeAuth(payload)

        let data = {
            equipo: user.ca_equipo.nombre,
            token: token,
            correo: req.body.correo,
            subject: "Unete a tu equipo.",
            option: 1
        }

        let send = await mail.sendMail(data)

        if (send.status != 200) {
            return res.status(400).json({ mensaje: "No fue posible enviar la invitacion." })
        }

        return res.status(200).json({ mensaje: "Invitación enviada con éxito." })

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json(error)
    }
}

async function findAll(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let users = await ca_usuarios.findAll({
            where: {
                id_equipo: usr.equipo
            },
            include: {
                model: ca_roles,
                attributes: ['descripcion'],
            },
            raw: true,
            order: [['id_rol', 'ASC']],
            transaction
        },
        )
        return res.status(200).json(users)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

async function findById(req, res) {

    let transaction

    try {

        transaction = await db.sequelize.transaction()

        let user = await ca_usuarios.findOne({
            where: {
                id: req.params.id,
            },
            include: {
                model: ca_roles,
            },
            raw: true
        },
        )

        return res.status(200).json(user)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json(error)
    }
}

async function create(req, res) {

    let json = {}
    let transaction

    try {

        let rule = rules.create(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.json(json)
        }

        transaction = await db.sequelize.transaction()

        let repeat = await ca_usuarios.findOne({
            where: {
                correo: req.body.correo,
            },
            transaction
        })

        if (repeat) {
            return res.status(401).json({ mensaje: 'Ya existe un usuario con el correo proporcionado.' })
        }

        let newEquipo = await ca_equipos.create({
            nombre: req.body.nombre_equipo,
            integrantes: { "id": [] }
        }, { transaction })

        if (!newEquipo) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible agregar el equipo.',
            });
        }

        let newUsuario = await ca_usuarios.create({
            id_equipo: newEquipo["dataValues"].id,
            nombre: req.body.nombre,
            contrasenia: req.body.contrasenia,
            correo: req.body.correo,
            id_rol: config.api.rol.administrador,
            is_admin: true,
            estatus: false
        }, { transaction })

        if (!newUsuario) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible agregar al usuario.',
            });
        }

        await transaction.commit();

        let payload = {
            "id": newUsuario["dataValues"].id,
            "correo": newUsuario["dataValues"].correo,
            "estatus": newUsuario["dataValues"].estatus,
            "exp": moment().add(1, "hour").unix(),
        }

        let token = auth.encodeAuth(payload)

        let data = {
            correo: newUsuario["dataValues"].correo,
            subject: "Confirmar cuenta.",
            token: token,
            option: 3
        }

        let send = await mail.sendMail(data)

        if (send.status != 200) {
            return res.status(400).json({ mensaje: "No fue posible enviar el correo." })
        }

        json.mensaje = "Revisa tu correo electronico para confirmar tu cuenta."

        return res.status(200).json(json)

    } catch (error) {
        console.error(error)
        transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

async function createMember(req, res) {

    let json = {}
    let transaction

    try {

        let usr = auth.decodeAuth(req)

        let rule = rules.createMember(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.json(json)
        }

        transaction = await db.sequelize.transaction()

        let repeat = await ca_usuarios.findOne({
            where: {
                correo: req.body.correo,
            },
            transaction
        })

        if (repeat) {
            return res.status(401).json({ mensaje: 'Ya existe un usuario con el correo proporcionado.' })
        }

        let newUsuario = await ca_usuarios.create({
            id_equipo: usr.equipo,
            nombre: req.body.nombre,
            contrasenia: req.body.contrasenia,
            correo: req.body.correo,
            id_rol: config.api.rol.empleado,
            is_admin: usr.is_admin,
            estatus: true
        }, { transaction })

        if (!newUsuario) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible agregar al usuario.',
            });
        }

        let equipo = await ca_equipos.findOne({
            where: {
                id: usr.equipo
            },
            raw: true,
            transaction
        })

        equipo.integrantes['id'].push(parseInt(newUsuario["dataValues"].id))

        let updateEquipo = await ca_equipos.update(
            {
                integrantes: equipo.integrantes
            },
            {
                where: {
                    id: usr.equipo
                }
            }, transaction
        )

        if (!updateEquipo || updateEquipo[0] != 1) {
            await transaction.rollback();
            return res.status(400).send({
                mensaje: 'Lo sentimos, no fue posible agregar al usuario al equipo.',
            });
        }

        await transaction.commit()

        json.mensaje = "Usuario creado con éxito."

        return res.status(200).json(json)

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

async function update(req, res) {

    let json = {}
    let transaction

    try {

        let rule = rules.update(req.body)
        if (rule.codigo != 0) {
            json.mensaje = rule.mensaje
            return res.status(401).json(json)
        }

        let transaction = await db.sequelize.transaction()

        let updateUsuario = await ca_usuarios.update(
            {
                nombre: req.body.nombre,
                contrasenia: req.body.contrasenia,
                correo: req.body.correo,
            },
            {
                where: {
                    id: req.params.id
                },
                transaction
            })

        if (!updateUsuario || updateUsuario[0] != 1) {
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
        await transaction.rollback()
        return res.status(500).json(error)
    }
}

async function remove(req, res) {

    let json = {}
    let transaction

    try {

        let usr = auth.decodeAuth(req)
        if (usr.rol != config.api.rol.administrador) {
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

        let deleteUsuario = await ca_usuarios.destroy({
            where: {
                id: req.params.id,
                id_equipo: usr.equipo,
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
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

async function confirmar(req, res) {

    let transaction

    try {

        let usr = auth.decodeAuth(req)

        transaction = await db.sequelize.transaction()

        let user = await ca_usuarios.findOne({
            where: {
                id: usr.id,
                correo: usr.correo,
                estatus: usr.estatus
            },
            transaction
        })

        if (!user) {
            await transaction.rollback()
            return res.status(400).json({ mensaje: 'Error!' })
        }

        let update = await ca_usuarios.update(
            {
                estatus: true
            },
            {
                where: {
                    id: usr.id,
                    correo: usr.correo,
                    estatus: usr.estatus
                },
                transaction
            },
        )

        if (!update || update[0] != 1) {
            await transaction.rollback()
            return res.status(400).json({ mensaje: 'No fue posible confirmar la cuenta.' })
        }

        await transaction.commit()

        return res.status(200).json({ mensaje: 'Cuenta confirmada.' })

    } catch (error) {
        console.error(error)
        await transaction.rollback()
        return res.status(500).json({ msg: error })
    }
}

module.exports = {
    crearSesion,
    restorePwd,
    forgotPwd,
    newMemberToken,
    findAll,
    findById,
    create,
    createMember,
    update,
    remove,
    confirmar,
}
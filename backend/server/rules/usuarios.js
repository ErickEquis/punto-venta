function createSesion(body) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (!body.correo || typeof body.correo !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el correo del usuario"
        return json
    }
    if (!body.contrasenia || typeof body.contrasenia !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesaria la contraseña del usuario"
        return json
    }

    return json
}

function create(body) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (!body.nombre || typeof body.nombre !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el nombre del usuario"
        return json
    }
    if (!body.correo || typeof body.correo !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el correo del usuario"
        return json
    }
    if (!body.contrasenia || typeof body.contrasenia !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesaria la contraseña del usuario"
        return json
    }

    return json
}

function createMember(body) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (!body.nombre || typeof body.nombre !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el nombre del usuario"
        return json
    }
    if (!body.correo || typeof body.correo !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el correo del usuario"
        return json
    }
    if (!body.contrasenia || typeof body.contrasenia !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesaria la contraseña del usuario"
        return json
    }

    return json
}

function update(body) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (typeof body.nombre !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el nombre del usuario"
        return json
    }
    if (typeof body.correo !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el correo del usuario"
        return json
    }
    if (typeof body.contrasenia !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesaria la contraseña del usuario"
        return json
    }

    return json
}

function remove(req) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (!req.params.id) {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el id del usuario"
        return json
    }

    return json
}

module.exports = {
    createSesion,
    create,
    createMember,
    update,
    remove,
}
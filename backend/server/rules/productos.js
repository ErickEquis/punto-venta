function findById(req) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (!req.params.id) {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el id del producto"
        return json
    }

    return json
}

function create(body) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (!body.descripcion || typeof body.descripcion !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesaria la descripcion del producto"
        return json
    }
    if (!body.precio || body.precio <= 0 || typeof body.precio !== "number") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el precio del producto"
        return json
    }
    if (!body.cantidad || body.cantidad <= 0 || typeof body.cantidad !== "number") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesaria la cantidad del producto"
        return json
    }

    return json
}

function update(body) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (typeof body.descripcion !== "string") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesaria la descripcion del producto"
        return json
    }
    if (body.precio <= 0 || typeof body.precio !== "number") {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesario el precio del producto"
        return json
    }
    if (body.cantidad <= 0) {
        json.codigo = 1
        json.mensaje = "Lo sentimos es necesaria la cantidad del producto"
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
        json.mensaje = "Lo sentimos es necesario el id del producto"
        return json
    }

    return json
}

module.exports = {
    findById,
    create,
    update,
    remove,
}
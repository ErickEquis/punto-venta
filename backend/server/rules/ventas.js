function create(body) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (!body.productos || body.productos.length == 0) {
        json.codigo = 1
        json.mensaje = "Lo sentimos es requerido al menos un producto"
        return json
    }

    if (!body.total_venta || body.total_venta < 0) {
        json.codigo = 1
        json.mensaje = "Error en el total de venta"
        return json
    }

    return json
}

function update(req) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }

    if (!req.params.id) {
        json.codigo = 1
        json.mensaje = "Lo sentimos es requerido el id de la venta"
        return json
    }

    if (!req.body.productos || req.body.productos.length == 0) {
        json.codigo = 1
        json.mensaje = "Lo sentimos es requerido al menos un producto"
        return json
    }

    if (!req.body.total_venta || req.body.total_venta < 0) {
        json.codigo = 1
        json.mensaje = "Error en el total de venta"
        return json
    }

    return json
}

module.exports = {
    create,
    update,
}
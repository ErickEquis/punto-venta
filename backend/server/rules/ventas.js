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

    for (let i = 0; i < body.productos.length; i++) {
        if (
            typeof body.productos[i]["cantidad"] != "number" ||
            typeof body.productos[i]["descripcion"] != "string" ||
            typeof body.productos[i]["id"] != "string" ||
            typeof body.productos[i]["precio"] != "number" ||
            typeof body.productos[i]["stock"] != "number"
        ) {
            json.codigo = 1
            json.mensaje = "Lo sentimos no fue posible registrar la venta"
            return json
        }

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

    if (req.body.total_venta < 0) {
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
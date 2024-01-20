function create(body) {
    let json = {
        codigo: 0,
        mensaje: "Éxito"
    }
    if (body.productos.length == 0) {
        json.codigo = 1
        json.mensaje = "Lo sentimos es requerido al menos un producto"
        return json
    }

    if (body.total_venta < 0) {
        json.codigo = 1
        json.mensaje = "Error en el total de venta"
        return json
    }

    return json
}

module.exports = {
    create
}
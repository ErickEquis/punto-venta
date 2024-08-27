const producto = require('../controllers/productos.js')
const auth = require('../services/auth.js')
const config = require('../config/config')

module.exports = (app) => {
    app.get(config.api.base_path + '/productos', auth.ensureAuth, producto.findAll)
    app.get(config.api.base_path + '/productos/:id', auth.ensureAuth, producto.findById)
    app.get(config.api.base_path + '/productos/codigo/:codigo', auth.ensureAuth, producto.findCodigo)
    app.post(config.api.base_path + '/productos', auth.ensureAuth, producto.create)
    app.patch(config.api.base_path + '/productos/:id', auth.ensureAuth, producto.update)
    app.delete(config.api.base_path + '/productos/:id', auth.ensureAuth, producto.logicalDelete)
    // app.delete(config.api.base_path + '/productos/delete/:id', auth.ensureAuth, producto.remove)
}
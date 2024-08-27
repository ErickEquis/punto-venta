const venta = require('../controllers/ventas.js')
const auth = require('../services/auth.js')
const config = require('../config/config')

module.exports = (app) => {
    app.get(config.api.base_path + '/ventas', auth.ensureAuth, venta.findAll)
    app.get(config.api.base_path + '/ventas/:id', auth.ensureAuth, venta.findById)
    app.get(config.api.base_path + '/ventas-total', auth.ensureAuth, venta.findTotal)
    app.get(config.api.base_path + '/ventas-vendedores', auth.ensureAuth, venta.findMayorVendedores)
    app.post(config.api.base_path + '/ventas', auth.ensureAuth, venta.create)
    app.patch(config.api.base_path + '/ventas/:id', auth.ensureAuth, venta.update)
    app.delete(config.api.base_path + '/ventas/:id', auth.ensureAuth, venta.remove)
    app.get(config.api.base_path + '/ventas-historial/:id', auth.ensureAuth, venta.historialVentas)
}
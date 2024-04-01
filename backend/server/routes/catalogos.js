const producto = require('../controllers/productos.js')
const usuario = require('../controllers/usuarios.js')
const venta = require('../controllers/ventas.js')
const notifiacion = require('../controllers/notificaciones.js')

const auth = require('../services/auth.js')

const config = require('../config/config')

module.exports = (app) => {
    app.post(config.api.base_path + '/auth', usuario.create)
    app.patch(config.api.base_path + '/auth', usuario.crearSesion)
    app.put(config.api.base_path + '/auth/forgot-pwd', usuario.forgotPwd)
    app.patch(config.api.base_path + '/auth/restore-pwd', auth.ensureAuthParam, usuario.restorePwd)
    app.put(config.api.base_path + '/auth/new-member/token', auth.ensureAuth, usuario.newMemberToken)
    app.post(config.api.base_path + '/auth/new-member', auth.ensureAuthParam, usuario.createMember)
    app.patch(config.api.base_path + '/auth/confirmar-cuenta', auth.ensureAuthParam, usuario.confirmar)

    app.get(config.api.base_path + '/usuarios', auth.ensureAuth, usuario.findAll)
    app.get(config.api.base_path + '/usuarios/:id', auth.ensureAuth, usuario.findById)
    app.delete(config.api.base_path + '/usuarios/:id', auth.ensureAuth, usuario.remove)

    app.get(config.api.base_path + '/productos', auth.ensureAuth, producto.findAll)
    app.get(config.api.base_path + '/productos/:id', auth.ensureAuth, producto.findById)
    app.get(config.api.base_path + '/productos/codigo/:codigo', auth.ensureAuth, producto.findCodigo)
    app.post(config.api.base_path + '/productos', auth.ensureAuth, producto.create)
    app.patch(config.api.base_path + '/productos/:id', auth.ensureAuth, producto.update)
    app.delete(config.api.base_path + '/productos/:id', auth.ensureAuth, producto.logicalDelete)
    // app.delete(config.api.base_path + '/productos/delete/:id', auth.ensureAuth, producto.remove)

    app.get(config.api.base_path + '/ventas', auth.ensureAuth, venta.findAll)
    app.get(config.api.base_path + '/ventas/:id', auth.ensureAuth, venta.findById)
    app.get(config.api.base_path + '/ventas-total', auth.ensureAuth, venta.findTotal)
    app.get(config.api.base_path + '/ventas-vendedores', auth.ensureAuth, venta.findMayorVendedores)
    app.post(config.api.base_path + '/ventas', auth.ensureAuth, venta.create)
    app.patch(config.api.base_path + '/ventas/:id', auth.ensureAuth, venta.update)
    app.delete(config.api.base_path + '/ventas/:id', auth.ensureAuth, venta.remove)
    app.get(config.api.base_path + '/ventas-historial/:id', auth.ensureAuth, venta.historialVentas)

    app.get(config.api.base_path + '/notificaciones/count', auth.ensureAuth, notifiacion.countNotificaciones)
    app.get(config.api.base_path + '/notificaciones', auth.ensureAuth, notifiacion.getNotificaciones)
    app.delete(config.api.base_path + '/notificaciones/:id', auth.ensureAuth, notifiacion.remove)

}
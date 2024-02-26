const producto = require('../controllers/productos.js')
const usuario = require('../controllers/usuarios.js')
const venta = require('../controllers/ventas.js')
const notifiacion = require('../controllers/notificaciones.js')

const auth = require('../services/auth.js')

module.exports = (app) => {
    app.post('/auth', usuario.create)
    app.patch('/auth', usuario.crearSesion)
    app.put('/auth/forgot-pwd', usuario.forgotPwd)
    app.patch('/auth/restore-pwd', auth.ensureAuthParam, usuario.restorePwd)
    app.put('/auth/new-member/token', auth.ensureAuth, usuario.newMemberToken)
    app.post('/auth/new-member', auth.ensureAuthParam, usuario.createMember)

    app.get('/usuarios', auth.ensureAuth, usuario.findAll)
    app.get('/usuarios/:id', auth.ensureAuth, usuario.findById)
    app.delete('/usuarios/:id', auth.ensureAuth, usuario.remove)

    app.get('/productos', auth.ensureAuth, producto.findAll)
    app.get('/productos/:id', auth.ensureAuth, producto.findById)
    app.get('/productos/codigo/:codigo', auth.ensureAuth, producto.findCodigo)
    app.post('/productos', auth.ensureAuth, producto.create)
    app.patch('/productos/:id', auth.ensureAuth, producto.update)
    app.delete('/productos/:id', auth.ensureAuth, producto.remove)

    app.get('/ventas', auth.ensureAuth, venta.findAll)
    app.get('/ventas/:id', auth.ensureAuth, venta.findById)
    app.get('/ventas-total', auth.ensureAuth, venta.findTotal)
    app.get('/ventas-vendedores', auth.ensureAuth, venta.findMayorVendedores)
    app.post('/ventas', auth.ensureAuth, venta.create)
    app.patch('/ventas/:id', auth.ensureAuth, venta.update)
    app.delete('/ventas/:id', auth.ensureAuth, venta.remove)

    app.get('/notificaciones/count', auth.ensureAuth, notifiacion.countNotificaciones)
    app.get('/notificaciones', auth.ensureAuth, notifiacion.getNotificaciones)
    app.delete('/notificaciones/:id', auth.ensureAuth, notifiacion.remove)
}
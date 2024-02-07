const producto = require('../controllers/productos.js')
const usuario = require('../controllers/usuarios.js')
const venta = require('../controllers/ventas.js')

const auth = require('../services/auth.js')

module.exports = (app) => {
    app.get('/productos', auth.ensureAuth, producto.findAll)
    app.get('/productos/:id', auth.ensureAuth, producto.findById)
    app.get('/productos/codigo/:codigo', auth.ensureAuth, producto.findCodigo)
    app.post('/productos', auth.ensureAuth, producto.create)
    app.patch('/productos/:id', auth.ensureAuth, producto.update)
    app.delete('/productos/:id', auth.ensureAuth, producto.remove)

    app.get('/usuarios', auth.ensureAuth, usuario.findAll)
    app.get('/usuarios/:id', auth.ensureAuth, usuario.findById)
    app.delete('/usuarios/:id', auth.ensureAuth, usuario.remove)

    app.post('/auth', usuario.create)
    app.patch('/auth', usuario.crearSesion)
    app.put('/auth/forgot-pwd', usuario.forgotPwd)
    app.patch('/auth/restore-pwd', auth.ensureAuthParam, usuario.restorePwd)
    app.put('/auth/new-member/token', usuario.newMemberToken)
    app.post('/auth/new-member', usuario.createMember)

    app.get('/ventas', venta.findAll)
    app.get('/ventas/:id', venta.findById)
    app.get('/ventas-total', venta.findTotal)
    app.post('/ventas', venta.create)
    app.patch('/ventas/:id', venta.update)
    app.delete('/ventas/:id', venta.remove)
}
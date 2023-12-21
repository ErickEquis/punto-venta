const producto = require('../controllers/productos.js')
const usuario = require('../controllers/usuarios.js')

module.exports = (app) => {
    app.get('/productos', producto.findAll)
    app.get('/productos/:id', producto.findById)
    app.post('/productos', producto.create)
    app.patch('/productos/:id', producto.update)
    app.delete('/productos/:id', producto.remove)

    app.get('/usuarios', usuario.findAll)
    app.get('/usuarios/:id', usuario.findById)
    app.post('/usuarios', usuario.create)
    app.patch('/usuarios', usuario.crearSesion)
}
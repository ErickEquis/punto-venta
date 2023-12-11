const producto = require('../controllers/productos.js')

module.exports = (app) => {
    app.get('/productos', producto.findAll)
    app.get('/productos/:id', producto.findById)
    app.post('/productos', producto.create)
    app.patch('/productos/:id', producto.update)
    app.delete('/productos/:id', producto.remove)
}
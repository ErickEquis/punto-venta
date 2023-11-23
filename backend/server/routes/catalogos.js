const producto = require('../controllers/productos.js')

module.exports = (app) => {
    app.get('/', producto.findAll)
    app.post('/', producto.create)
    app.patch('/:id', producto.update)
    app.delete('/:id', producto.remove)
}
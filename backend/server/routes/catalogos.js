const producto = require('../controllers/productos.js')

module.exports = (app) => {
    app.get('/', producto.findAll)
    app.post('/', producto.create)
    app.patch('/', producto.update)
    app.delete('/', producto.remove)
}
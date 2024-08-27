const notifiacion = require('../controllers/notificaciones.js')
const auth = require('../services/auth.js')
const config = require('../config/config')

module.exports = (app) => {
    app.get(config.api.base_path + '/notificaciones/count', auth.ensureAuth, notifiacion.countNotificaciones)
    app.get(config.api.base_path + '/notificaciones', auth.ensureAuth, notifiacion.getNotificaciones)
    app.delete(config.api.base_path + '/notificaciones/:id', auth.ensureAuth, notifiacion.remove)
}
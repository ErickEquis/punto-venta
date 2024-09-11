const usuario = require('../controllers/usuarios.js')
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

    app.get(config.api.base_path + '/healthcheck', async (req, res) => {
        try {
            res.status(200).send("Healthcheck")
        } catch (error) {
            res.status(500)
        }
    })

}
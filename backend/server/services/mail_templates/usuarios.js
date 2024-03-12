function newMember(data) {

    return `
    <h1>Bienvenido al equipo: ${data.equipo}</h1><br>
    <p>Para registrarte por favor da click en el siguiente link</p><br>
    <a href="http://localhost:4040/auth/new-member?token=${data.token}"> Registrarse </a>
    `

}

function restorePwd(data) {

    return `
    <h1>Reestablece tu contraseña.</h1>
    <p>Para restlabecer tu contraseña da click en el siguiente link.</p>
    <a href="http://localhost:4040/auth/restore-password?token=${data.token}"> Restaurar contraseña. </a>
    `

}

function newUsuario(data) {

    return `
    <h1>Bienvenido a Point.</h1>
    <p>Por favor da click en el siguiente enlace para confirmar tu correo electronico.</p>
    <a href="http://localhost:4040/auth/confirmar-cuenta?token=${data.token}"> Confirmar cuenta. </a>
    `

}

module.exports = {
    newMember,
    restorePwd,
    newUsuario
}
const nodemailer = require('nodemailer');

const config = require('../config/config')
const template_usuarios = require('./mail_templates/usuarios')

async function sendMail(data) {

    try {

        let json = {
            status: 200,
            mensaje: 'Correo enviado con éxito.'
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.api.mail,
                pass: config.api.token_mail
            }
        });

        const mailOptions = {
            from: config.api.mail,
            to: data.correo,
            subject: data.subject,
            html: selectTemplate(data)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('...correo no enviado');
                json.status = 400
                json.mensaje = 'Error al enviar el correo.'
                return json
            } else {
                console.log("...correo enviado");
            }
        });

        return json

    } catch (error) {
        console.error('...correo no enviado.')
        console.error(error)
    }

}

function selectTemplate(data) {
    switch (data.option) {
        case 1:
            return template_usuarios.newMember(data);

        case 2:
            return template_usuarios.restorePwd(data);

        case 3:
            return template_usuarios.newUsuario(data);

        default:
            break;
    }
}

module.exports = {
    sendMail
}
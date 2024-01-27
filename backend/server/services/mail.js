const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const config = require('../config/config')

async function mail() {

    try {

        // const oauth2Client = new OAuth2(
        //     config.api.mail.client_id,
        //     config.api.mail.client_secret,
        //     "https://developers.google.com/oauthplayground",
        // );

        const oauth2Client = new google.auth.OAuth2(
            config.api.mail.client_id,
            config.api.mail.client_secret,
            config.api.mail.redirect_uris,
        );

        const { tokens } = await oauth2Client.getToken(code)
        
        oauth2Client.setCredentials(tokens);

        // let credenciales = oauth2Client.setCredentials({
        //     refresh_token: '1//049p2TbcyKwL9CgYIARAAGAQSNwF-L9IrNOQoP6Er086DC7vR9GgFqF1qXiCM4fsLUtMHfF9qSuGGYCbJrSMJ24-rEnVXZQIPc-4',
        //     tls: {
        //         rejectUnauthorized: false
        //     }
        // });

        // console.log('refresh_token', config.api.mail.refresh_token)

        // console.log('credenciales', credenciales)

        // let token = (await oauth2Client.getAccessToken())['token'];

        // console.log('token', token, '-----')

        // // oauth2Client.getAccessToken((err, token) => {
        // //     if (err)
        // //         return console.log(err);;
        // //     config.api.mail.accessToken = token;
        // //     callback(nodemailer.createTransport(accountTransport));
        // // });

        // const auth = {
        //     type: "OAuth2",
        //     user: "no.responder.point@gmail.com",
        //     clientId: config.api.mail.client_id,
        //     clientSecret: config.api.mail.client_secret,
        //     accessToken: token,
        // };

        // const mailoptions = {
        //     authMethod: "OAuth2",
        //     from: "Terriblero <no.responder.point@gmail.com>",
        //     to: "erick.cfeteit@gmail.com",
        //     subject: "Gmail API NodeJS",
        // };

        // let transport = nodemailer.createTransport({
        //     // host: "https://mail.google.com/",
        //     service: "gmail",
        //     // secure: true,
        //     auth: {
        //         // auth: auth,
        //         type: "OAuth2",
        //         user: "no.responder.point@gmail.com",
        //         clientId: config.api.mail.client_id,
        //         clientSecret: config.api.mail.client_secret,
        //         accessToken: 'ya29.a0AfB_byBVh2NT0IP5s-dL67C4CVUtvqcAnZI52rOe6xiUXaj2F8JuR2sLc-kfJhaOdpui0NyUvwozMUqIt_gc0nmJDucboG7core800XS3s1rHN86cXHVQaCZDbvvs70d35K1n3nrr-lD9e3roahjk0nupZuGMmrAjrJ1aCgYKAYoSARISFQHGX2MihIE68VzMiPXbKiRXcWpklw0171',
        //         // oauth2: {
        //         //     user: "no.responder.point@gmail.com",
        //         //     clientId: config.api.mail.client_id,
        //         //     clientSecret: config.api.mail.client_secret,
        //         //     accessToken: token,
        //         // }
        //     },
        // });

        // // console.log('transport', transport)

        // let mailOptions = {
        //     mailoptions: mailoptions,
        //     text: "The Gmail API with NodeJS works",
        // };

        // // console.log(mailOptions)

        // let result = await transport.sendMail(mailOptions);
        // console.log('result', result)
        // console.log('...correo enviado con éxito.')
        return { mensaje: "Éxito." }

    } catch (error) {
        console.error('...correo no enviado.')
        console.error(error)

    }

}

module.exports = {
    mail
}


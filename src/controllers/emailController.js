const verificar = require('email-verify')
var nodemailer = require('nodemailer');

module.exports = {
    verificar_email: verificar.verify,

    send_email: (email, secret) => {

        let transporter = nodemailer.createTransport({
            host: "mail.claudinosa.com.br",
            port: 465,
            pool: true,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
            tls: { rejectUnauthorized: false }
        });

        var mailOptions = {
            from: `"Ponto Claudino S/A" <${process.env.EMAIL}>`, // sender address
            to: email, // list of receivers
            subject: 'Verificação de e-mail', // Subject line
            html: `<html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <meta charset="utf-8">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
            </head>
            <body>
            
                <div id="container_confirmacao" class="container-fluid" >
                    <div class="card text-center">
                        <div class="card-header">
                            E-mail de confirmação
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Cadastro realizado</h5>
                            <p class="card-text" style="font-color: #00FF7F">Clique no botão abaixo para confirmar seu email!!!</p>
                            <a href="http://localhost:3003/auth/${secret}" class="btn btn-primary">CONFIRMAR</a>
                        </div>
                        
                    </div>
                </div>



    
            </form>
            </body>
            </html>` // html body 
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        })
    }
}
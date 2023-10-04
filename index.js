
var bodyParser = require('body-parser');
const express = require("express");
const app = express();
const email = require('nodemailer')

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.post('/email/send', async function(req, res){
    if ( req.body.email & req.body.email.oath && req.body.email.oath.host && req.body.email.oath.port && req.body.email.oath.ssl && req.body.email.oath.mail && req.body.email.oath.pass) {
        let transporter = email.createTransport({
            host: req.body.email.oath.host,
            port: req.body.email.oath.port,
            secure: req.body.email.oath.ssl,
            auth: {
                user: req.body.email.oath.mail,
                pass: req.body.email.oath.pass
            }
        })
        transporter.sendMail({
            from: req.body.email.from,
            to: req.body.email.to,
            subject: req.body.email.subject,
            text: req.body.email.text,
            html: unCoder(req.body.email.html)
        }).then(async message => {

            res.json({
                status: true,
                messageId: message.messageId,
                responseclient: message.response,
                receivedfrom: message.accepted[0],
            })

        }).catch(err => {
            console.log(err)
            res.json({
                status: false
            })
        })
    } else {
        console.log(1)
        res.json({
            status: false,
            message: 'can\'t authorize',
        })
    }
});


function unCoder(text) {
    if (text) {
        const buff = Buffer.from(text, 'base64');
        const str = buff.toString('ascii');
    
        return str.toString()
    }else{
        return 'error'
    }
}

console.log("Servidor aberto na porta 80")
app.listen(80);


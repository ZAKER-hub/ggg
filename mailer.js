const nodemailer =  require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs');
const path = require('path');
const config = require('./config')
const mailFunc = {
    sendEmail: async function (email, url, name) {
        const filePath = path.join(__dirname, './emails/verifed_email.html');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);
        const replacements = {
          url: url,
          name: name
        };
        const htmlToSend = template(replacements);
        const transporter = nodemailer.createTransport({
          host: config.smtpHost,
          port: config.smtpPort,
          auth: {
            user: config.smtpUser,
            pass: config.smtpPasswword
          }
        });
        const mailOptions = {
          from: config.fromEmail,
          to: email,
          subject: config.emailTitle,
          html: htmlToSend,
          attachments: [{
            filename: 'Logo.png',
            path: __dirname +'/emails/logo.png',
            cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
       }]
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
      }
}
module.exports = mailFunc;
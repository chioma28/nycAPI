const { text } = require('body-parser');
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
require('dotenv').config();

const auth = {
    auth: {
        api_key: process.env.MAIL_API_KEY,
        domain: process.env.MAIL_DOMAIN
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendEmail = ( fullName, email, subject, message, to, ) => {
    const mailOptions = {
        from: email,
        to: 'naijayellowcatalog@gmail.com',
        subject: subject,
        html: text,
        text: message
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(`Error: ${err}`);
           
        }
        else {
         
         // console.log(`Response: ${info}`);
            // cb(null, info);
        }
      }
    );
}

module.exports = sendEmail;
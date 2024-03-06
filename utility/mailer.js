require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS,
    },
    
});

const sendMail = async ({ to, subject, html }) => {
    try {
        const result = await  transporter.sendMail({
            from: "bookdesk19@gmail.com",
            to,
            subject,
            html,
        });

        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    sendMail
}

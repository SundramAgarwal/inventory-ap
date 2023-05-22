// created after installing nodemailer created for 
// adding part of function forget password by 
// sending email

const nodemailer = require("nodemailer");

const sendEmail = async (subject,message,send_to,sent_from,reply_to) => {
    //what is email transporter
    // it is just like something that carries your email
    // from one point to another
    const transporter = nodemailer.createTransport({
        // so now it will take couple of properties
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    // options for sending email
    const options ={
        from: sent_from,
        to : send_to,
        replyTo: reply_to,
        subject: subject,
        html: message,
    }

    //  send email
    transporter.sendMail(options, function (err,info) {
        if (err) {
            console.log(err)
        }
        console.log(info)
    })
};

module.exports = sendEmail;
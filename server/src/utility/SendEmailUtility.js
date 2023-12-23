const nodemailer = require('nodemailer');
const path = require('path');
// const hbs = require('nodemailer-express-handlebars');
// const viewPath =  path.resolve(__dirname, '../template/views/');
// const partialsPath = path.resolve(__dirname, '../template/partials/');

const SendEmailUtility= async (EmailTo, EmailText, EmailSubject) => {

    let transporter = await nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 25,
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.PASSWORD_SEND_EMAIL,
        }
    });

    // transporter.use('compile', hbs({
    //     viewEngine: {
    //         extName: '.handlebars',
    //         // partialsDir: viewPath,
    //         layoutsDir: viewPath,
    //         defaultLayout: false,
    //         partialsDir: partialsPath,
    //     },
    //     viewPath: viewPath,
    //     extName: '.handlebars',
    // }));
    
    let mailOptions = {
        from: process.env.FROM_EMAIL,
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText,
        // template: 'index',
        // attachments: [
        //     { filename: 'abc.jpg', path: path.resolve(__dirname, '../template/image/abc.jpg')}
        // ]
    };

    
   return  await transporter.sendMail(mailOptions)

}
module.exports=SendEmailUtility



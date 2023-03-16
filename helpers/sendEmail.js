const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) =>
{
    const email = { ...data, from: "kateriinag@gmail.com" };
    await sgMail.send(email);
    return true;
}

module.exports = sendEmail;

// const email = {
//   to: "ostrynska.kateryna@gmail.com",
//   from: "kateriinag@gmail.com",
//   subject: "Test email",
//   html: "<p><strong>Test email</strong> from localhost:8080</p>"
// };

// sgMail.send(email)
//   .then(() => console.log("Email send success"))
//   .catch(error => console.log(error.message))
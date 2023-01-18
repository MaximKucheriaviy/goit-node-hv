const sgMailer = require('@sendgrid/mail');

require('dotenv').config();

const {SEND_GRID_KEY} = process.env;
sgMailer.setApiKey(SEND_GRID_KEY);

const sendVerifiMail = async (email, token) => {
    const mail = {
        from: "maxim-k@i.ua",
        to: email,
        subject: "verification email",
        html: createEmailText(token)
    }
    try{
        await sgMailer.send(mail);
    }
    catch(err){
        throw err;
    }
}


function createEmailText(token){
    return `<div>
        <h1>Hello from Maxim\`s Kucheriaviy home work</h1>
        <p>to verify your email go to this</p>
        <a href="http://localhost:3000/users/verify/${token}">LINK</a>
    </div>`
}
module.exports = {
    sendVerifiMail
}
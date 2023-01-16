const sgMailer = require('@sendgrid/mail');

require('dotenv').config();

const {SEND_GRID_KEY} = process.env;

const sendVerifiMail = (email, token) => {
    
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
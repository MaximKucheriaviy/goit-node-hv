const User = require('./usersDBmodel');
const bcrypt = require('bcrypt');


const createUser = async (newUser) => {
    try{
        const hasedPassword = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync());
        const result = await User.create({
            email: newUser.email,
            password: hasedPassword,
        })
        return result;
    }
    catch(err){
        err.status = 409;
        err.message = "Email in use"
        throw(err);
    }
    
}

module.exports = {
    createUser
}
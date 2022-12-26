const User = require('./usersDBmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { router } = require('../app');
require('dotenv').config();

const {JWT_KEYWORD} = process.env;


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

const loginUser = async (userData) => {
    try{
        
        const result = await User.findOne({
            email: userData.email
        })
        if(!result || !bcrypt.compareSync(userData.password, result.password)){
            throw(new Error);
        }

        const token = jwt.sign({
            _id: result._id
        }, JWT_KEYWORD);
        await User.findByIdAndUpdate(result._id, {
            token
        })
        return {
            token,
            user: {
                email: result.email,
                subscription: result.subscription
            }
        }
    }
    catch(err){
        console.log(err);
        err.status = 401;
        err.message = "Email or password is wrong"
        throw(err);
    }
}

const logoutUser = async (id) => {
    try{
        await User.findByIdAndUpdate(id, {
            token: null
        })
    }
    catch(err){
        throw(err);
    }
}


module.exports = {
    createUser,
    loginUser,
    logoutUser
}
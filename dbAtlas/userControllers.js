const User = require('./usersDBmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
require('dotenv').config();

const {JWT_KEYWORD} = process.env;


const createUser = async (newUser) => {
    try{
        const hasedPassword = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync());
        const result = await User.create({
            email: newUser.email,
            password: hasedPassword,
            avatarURL: gravatar.url(newUser.email),
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

const getUserInfo = async (id) => {
    try{
        const result = User.findById(id);
        return result;
    }
    catch(err){
        throw(err);
    }
}

const setSubscription = async(id, subscription) => {
    const subTypes = ['starter', 'pro', 'business'];
    try{
        if(subTypes.every(item => item !== subscription)){
            const err = new Error;
            err.message = "wrong subscription type";
            err.status = 400;
            throw(err);
        }
        const result = User.findByIdAndUpdate(id, {subscription});
        return result;
    }
    catch(err){
        throw(err);
    }
}

const updateAvatar = async(id, path) => {
    try{
        const result = await User.findByIdAndUpdate(id, {
            avatarURL: path
        })
        return result;
    }
    catch(err){
        throw err;
    }
}

const verifyUser = async (token) => {
    try{
        const result = await User.findOne({verificationToken: token});
        if(!result){
            const err = new Error;
            err.message = 'User not found';
            err.status = 404;
            throw err;
        }
        await User.findByIdAndUpdate(result._id, {
            verificationToken: null,
            verify: true
        })
    }
    catch(err){
        throw err;
    }

}

const setVerificationToken = async (email, token) => {
    try{
        const result = await User.findOne({email});
        if(result.verify){
            const err = new Error;
            err.status = 400;
            err.message = "Verification has already been passed";
            throw err;
        }
        await User.findByIdAndUpdate(result._id, {verificationToken: token});
    }
    catch(err){
        throw err;
    }
}


module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getUserInfo,
    setSubscription,
    updateAvatar,
    verifyUser,
    setVerificationToken,
}
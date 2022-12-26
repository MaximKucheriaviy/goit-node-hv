const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../dbAtlas/usersDBmodel');

const {JWT_KEYWORD} = process.env;

const auth = async (req, res, next) => {
    try{
        const authorization = req.headers.authorization
        const [bearer, token] = authorization.split(" ");
        const {_id} = jwt.verify(token, JWT_KEYWORD);
        const user = await User.findById(_id);
        if(!user || user.token != token){
            throw(new Error);
        }
        req.id = _id;
        next()
    }
    catch(err){
        err.status = 401;
        err.message = "Not authorized";
        next(err);
    }
    
}

module.exports = auth;
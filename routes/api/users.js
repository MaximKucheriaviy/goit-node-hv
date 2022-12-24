const express = require('express');
const { assert } = require('joi');
const router = express.Router()
const {addUserSchema} = require('../../validation/validation')
const {createUser} = require("../../dbAtlas/userControllers");


router.post('/register', async (req, res, next) => {
    try{
        const validation = addUserSchema.validate(req.body);
        if(validation.error){
            const err = new Error(validation.error);
            err.status = 400;
            throw(err);
        }
        const result = await createUser(req.body);
        res.status(201).json({
            user:{
                email: result.email,
                subscription: result.subscription
            }
        })
    }
    catch(err){
        next(err);
    }
})


module.exports = router;
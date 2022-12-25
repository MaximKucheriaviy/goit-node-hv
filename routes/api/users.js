const express = require('express');
const router = express.Router()
const {userDataSchema} = require('../../validation/validation')
const {createUser, loginUser} = require("../../dbAtlas/userControllers");
const auth = require('../../middleware/auth');


router.post('/register', async (req, res, next) => {
    try{
        const validation = userDataSchema.validate(req.body);
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

router.get("/login", async (req, res, next) => {
    try{
        const validation = userDataSchema.validate(req.body);
        if(validation.error){
            const err = new Error(validation.error);
            err.status = 400;
            throw(err);
        }
        const result = await loginUser(req.body);
        res.json({
            result
        })
    }   
    catch(err){
        next(err);
    }
})

router.post("/logout", auth, async (req, res) => {
    res.json({
        message: "OKOK"
    })
})


module.exports = router;
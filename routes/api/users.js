const express = require('express');
const router = express.Router()
const {userDataSchema} = require('../../validation/validation')
const {createUser, loginUser, logoutUser, getUserInfo, setSubscription} = require("../../dbAtlas/userControllers");
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

router.post("/login", async (req, res, next) => {
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

router.get("/logout", auth, async (req, res, next) => {
    try{
        await logoutUser(req.id);
        res.status(204).end();
    }
    catch(err){
        next(err);
    }
})

router.get('/current', auth, async (req, res, next) => {
    try{
        const result = await getUserInfo(req.id);
        res.json({
            email: result.email,
            subscription: result.subscription
        })
    }
    catch(err){
        next(err);
    }
})


router.patch('/', auth, async (req, res, next) => {
    try{
        await setSubscription(req.id, req.body. subscription);
        res.status(201).end();
    }
    catch(err){
        next(err);
    }
})


module.exports = router;
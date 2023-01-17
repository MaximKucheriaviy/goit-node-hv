const express = require('express');
const router = express.Router()
const {userDataSchema, reverificationSchema} = require('../../validation/validation')
const {createUser, loginUser, logoutUser, getUserInfo, setSubscription, updateAvatar, verifyUser, setVerificationToken} = require("../../dbAtlas/userControllers");
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');
const {v4} = require('uuid');
const verifyMailer = require('../../services/verifiMailer');

const avatarsPath = path.join(__dirname, "../../public/avatars/");

router.post('/register', async (req, res, next) => {
    try{
        const validation = userDataSchema.validate(req.body);
        if(validation.error){
            const err = new Error(validation.error);
            err.status = 400;
            throw(err);
        }
        const result = await createUser(req.body);
        await verifyMailer.sendVerifiMail(result.email, result.verificationToken);
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
            subscription: result.subscription,
            avatar: result.avatarURL
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


router.patch("/avatars", auth, upload.single('avatar'), async (req, res, next) => {
    try{
        const avatarURL = "/avatars/" + req.file.filename;
        const avararFullPath = path.join(avatarsPath, req.file.filename);
        (await jimp.read(req.file.path)).resize(250, 250).write(avararFullPath);
        await fs.unlink(req.file.path);
        const result = await updateAvatar(req.id, avatarURL);
        if(!result){
            next(err);
        }

        res.status(200).json({
            avatarURL: avatarURL
        })
    }
    catch(err){
        next(err);
    }
    
})

router.get('/verify/:verificationToken', async(req, res, next) => {
    try {
        const {verificationToken} = req.params;
        await verifyUser(verificationToken);
        res.json({
            message: 'Verification successful'
        })
    } catch (error) {
        next(error);
    }
})

router.post('/verify', async(req, res, next) => {
    const {email} = req.body;
    const result = reverificationSchema(req.body);
    if(result.error){
        const err = new Error;
        err.status = 400;
        err.message = "missing required field email";
        throw err;
    }
    const token = v4();
    try{
        await setVerificationToken(email, token);
        await verifyMailer.sendVerifiMail(email, token);
        res.status(200).end();
    }
    catch(err){
        next(err);
    }
})



module.exports = router;
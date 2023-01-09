const express = require('express');
const router = express.Router()
const {userDataSchema} = require('../../validation/validation')
const {createUser, loginUser, logoutUser, getUserInfo, setSubscription, updateAvatar} = require("../../dbAtlas/userControllers");
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs/promises');

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



module.exports = router;
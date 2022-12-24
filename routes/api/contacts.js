const express = require('express')
const dbControllers = require("../../dbAtlas/userControllers");
const { addBodySchema, putBodySchema } = require("../../validation/validation");
const router = express.Router()



router.get('/', async (req, res, next) => {
  try{
    const contactList = await dbControllers.getAllContacts();
    res.json(contactList);
  }
  catch(err){
    console.log(err);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try{
    const result = await dbControllers.getContactById(req.params.contactId);
    if(!result){
      const err = new Error("Not found");
      err.status = 404;
      throw(err);
    }
    res.json(result);
  }
  catch(err){
    next(err);
  }
})

router.post('/', async (req, res, next) => {
  try{
    const validation = addBodySchema.validate(req.body);
    if(validation.error){
      const err = new Error("missing required name field");
      err.status = 400;
      throw(err);
    }
    const newContact = await dbControllers.createContact(req.body);
    if(!newContact){
      throw(new Error("add error"));
    }
    res.status(201).json(newContact);
  }
  catch(err){
    next(err);
  }
  
})

router.delete('/:contactId', async (req, res, next) => {
  try{
    const result = await dbControllers.removeContact(req.params.contactId);
    if(!result){
      const err = new Error("Not found");
      err.status = 404;
      throw(err);
    }
    res.status(200).json({ message: 'contact deleted' })
  }
  catch(err){
    next(err);
  }
  
})

router.put('/:contactId', async (req, res, next) => {
  try{
    if(!req.body.hasOwnProperty("favorite")){
      const err = new Error("missing field favorite");
      err.status = 400;
      throw(err);
    }
    const validation = putBodySchema.validate(req.body);
    if(validation.error){
      const err = new Error("missing fields");
      err.status = 400;
      throw(err);
    }
    const result = await dbControllers.updateContact(req.params.contactId, req.body);
    if(!result){
      const err = new Error("Not found");
      err.status = 404;
      throw(err);
    }
    res.status(200).json(result);
  }
  catch(err){
    next(err);
  }
  
})

module.exports = router

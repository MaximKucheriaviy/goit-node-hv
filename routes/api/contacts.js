const express = require('express')
const dbModel = require('../../models/contacts');
const Joi = require("joi");

const router = express.Router()

const addBodySchema = Joi.object({
  name: Joi.string().alphanum().min(3).trim().required(),
  email: Joi.string().email().trim().required(),
  phone: Joi.string().min(3).trim().required(),
})

router.get('/', async (req, res, next) => {
  try{
    const contactList = await dbModel.listContacts();
    res.json(contactList);
  }
  catch(err){
    console.log(err);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try{
    const result = await dbModel.getContactById(req.params.contactId);
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
    const newContact = await dbModel.addContact(req.body);
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
    const result = await dbModel.removeContact(req.params.contactId);
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
    const validation = addBodySchema.validate(req.body);
    if(validation.error){
      const err = new Error("missing fields");
      err.status = 400;
      throw(err);
    }
    const result = await dbModel.updateContact(req.params.contactId, req.body);
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

const express = require('express')
const dbModel = require('../../models/contacts');

const router = express.Router()

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
      next();
    }
    res.json(result);
  }
  catch(err){
    console.log(err);
  }
})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router

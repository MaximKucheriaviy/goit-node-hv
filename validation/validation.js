const Joi = require("joi");


const addBodySchema = Joi.object({
    name: Joi.string().min(3).trim().required(),
    email: Joi.string().email().trim().required(),
    phone: Joi.string().min(3).trim().required(),
    favorite: Joi.boolean().optional()
  })
  
const putBodySchema = Joi.object({
  name: Joi.string().min(3).trim().required(),
  email: Joi.string().email().trim().required(),
  phone: Joi.string().min(3).trim().required(),
  favorite: Joi.boolean().required()
})

const userDataSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(3).trim().required()
})

const reverificationSchema = Joi.object({
  email: Joi.string().email().trim().required(),
})


  module.exports = {
    addBodySchema,
    putBodySchema,
    userDataSchema,
    reverificationSchema
  }
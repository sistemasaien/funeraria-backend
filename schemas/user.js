const joi = require('joi');
const joiMsg = require('./joi.messages');

const userUpdateSchema = joi.object({
    id: joi.number().required().messages(joiMsg.errorMsg),
    usuario: joi.string().required().messages(joiMsg.errorMsg),
    password: joi.string().required().messages(joiMsg.errorMsg),
    perfil: joi.number().required().messages(joiMsg.errorMsg),
    nombre: joi.string().required().messages(joiMsg.errorMsg),
    email: joi.string().email().required().messages(joiMsg.errorMsg)
}).options({ abortEarly: false });

const userCreateSchema = joi.object({
    usuario: joi.string().required().messages(joiMsg.errorMsg),
    password: joi.string().required().messages(joiMsg.errorMsg),
    perfil: joi.number().required().messages(joiMsg.errorMsg),
    nombre: joi.string().required().messages(joiMsg.errorMsg),
    email: joi.string().email().required().messages(joiMsg.errorMsg)
}).options({ abortEarly: false });

const userSchema = {
    userUpdateSchema,
    userCreateSchema
}

module.exports = userSchema;
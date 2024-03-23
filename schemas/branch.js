const joi = require('joi');
const joiMsg = require('./joi.messages');

const branchSchema = joi.object({
    id: joi.number().optional(),
    nombre: joi.string().required().messages(joiMsg.errorMsg),
    direccion: joi.string().required().messages(joiMsg.errorMsg),
    telefono: joi.string().required().messages(joiMsg.errorMsg),
    correo: joi.string().optional().allow(''),
}).options({ abortEarly: false });

module.exports = branchSchema;
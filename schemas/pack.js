const joi = require('joi');
const joiMsg = require('./joi.messages');

const packSchema = joi.object({
    ataudModelo: joi.string().required().messages(joiMsg.errorMsg),
    nombrePaquete: joi.string().required().messages(joiMsg.errorMsg),
    precioPaquete: joi.number().required().messages(joiMsg.errorMsg),
    id: joi.number().optional(),
    capilla: joi.string().optional().allow('')
}).options({ abortEarly: false });

module.exports = packSchema;
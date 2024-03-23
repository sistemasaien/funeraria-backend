const joi = require('joi');
const joiMsg = require('./joi.messages');

const departmentSchema = joi.object({
    id: joi.number().optional(),
    nombre: joi.string().required().messages(joiMsg.errorMsg),
    descripcion: joi.string().optional().allow(''),
}).options({ abortEarly: false });

module.exports = departmentSchema;
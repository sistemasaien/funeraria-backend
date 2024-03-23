//id, idUsuario, nombre, tipo, departamento, sucursal, recorrido, contacto, telefono, telefonoEmergencia
//required: nombre,tipo, idUsuario

const joi = require('joi');
const joiMsg = require('./joi.messages');

const employeeSchema = joi.object({
    id: joi.number().optional(),
    idUsuario: joi.number().required().messages(joiMsg.errorMsg),
    nombre: joi.string().required().messages(joiMsg.errorMsg),
    tipo: joi.string().required().messages(joiMsg.errorMsg),
    departamento: joi.string().optional().allow(''),
    sucursal: joi.string().optional().allow(''),
    recorrido: joi.string().optional().allow(''),
    contacto: joi.string().optional().allow(''),
    telefono: joi.string().optional().allow(''),
    telefonoEmergencia: joi.string().optional().allow(''),
}).options({ abortEarly: false });

module.exports = employeeSchema;

const joi = require('joi');
const joiMsg = require('./joi.messages');

//id, codigoPostal, correo, domicilio, domicilioCobranza, estadoCivil, fechaDesde, fechaNacimiento, localidad, municipio, estado, nombre, ocupacion, referenciaDomicilioCobranza, telefono, telefonoCobranza

const clientSchema = joi.object({
    id: joi.number().optional(),
    codigoPostal: joi.string().optional().allow(''),
    correo: joi.string().optional().allow(''),
    domicilio: joi.string().required().messages(joiMsg.errorMsg),
    domicilioCobranza: joi.string().required().messages(joiMsg.errorMsg),
    estadoCivil: joi.string().optional().allow(''),
    fechaDesde: joi.date().required().messages(joiMsg.errorMsg),
    fechaNacimiento: joi.date().required().messages(joiMsg.errorMsg),
    localidad: joi.string().required().messages(joiMsg.errorMsg),
    municipio: joi.string().required().messages(joiMsg.errorMsg),
    estado: joi.string().required().messages(joiMsg.errorMsg),
    nombre: joi.string().required().messages(joiMsg.errorMsg),
    ocupacion: joi.string().optional().allow(''),
    referenciaDomicilioCobranza: joi.optional().allow(''),
    telefono: joi.string().required().messages(joiMsg.errorMsg),
    telefonoCobranza: joi.string().required().messages(joiMsg.errorMsg),
}).options({ abortEarly: false });

module.exports = clientSchema;
const joi = require('joi');
const joiMsg = require('./joi.messages');

//id, idCliente, idContrato, idSolicitud, idFinanciamiento, estado, asesor, cobrador, metodoPago, fechaLiquidacion
//cobrador optional, fechaliquidacion optional

const saleSchema = joi.object({
    id: joi.number().optional(),
    idCliente: joi.number().required().messages(joiMsg.errorMsg),
    idContrato: joi.number().required().messages(joiMsg.errorMsg),
    idSolicitud: joi.number().required().messages(joiMsg.errorMsg),
    idFinanciamiento: joi.number().required().messages(joiMsg.errorMsg),
    estado: joi.string().required().messages(joiMsg.errorMsg),
    asesor: joi.string().required().messages(joiMsg.errorMsg),
    cobrador: joi.string().optional().allow(''),
    metodoPago: joi.string().required().messages(joiMsg.errorMsg),
    fechaLiquidacion: joi.date().optional().allow(''),
}).options({ abortEarly: false });

module.exports = saleSchema;
const requestsService = require('../services/requests');
const errors = require('../helpers/errors');

const getRequests = async (req, res, next) => {
    try {
        const requests = await requestsService.getRequests();
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

const getRequest = async (req, res, next) => {
    const { id } = req.params;
    try {
        const request = await requestsService.getRequest(id);
        if (!request) {
            errors.notFoundError('Solicitud no encontrada', 'REQUEST_NOT_FOUND');
        }
        res.status(200).json(request);
    } catch (error) {
        next(error);
    }
};

const createRequest = async (req, res, next) => {
    const { idCliente, idBeneficiario, idFallecido, idPaquete, idServicio, idCeremonia, tipo } = req.body;
    const request = { nombre, descripcion, fecha };
    try {
        const newRequest = await requestsService.createRequest(request);
        res.status(200).json(newRequest);
    } catch (error) {
        next(error);
    }
};

const updateRequest = async (req, res, next) => {
    const { id, idCliente, idBeneficiario, idFallecido, idPaquete, idServicio, idCeremonia, tipo } = req.body;
    const request = { id, nombre, descripcion, fecha };
    try {
        const updatedRequest = await requestsService.updateRequest(id, request);
        res.status(200).json(updatedRequest);
    } catch (error) {
        next(error);
    }
};

const deleteRequest = async (req, res, next) => {
    const { id } = req.body;
    try {
        const deletedRequest = await requestsService.deleteRequest(id);
        res.status(200).json(deletedRequest);
    } catch (error) {
        next(error);
    }
};

const requestsController = {
    getRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest
};

module.exports = requestsController;

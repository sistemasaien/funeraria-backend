const { PrismaClient } = require('@prisma/client');
const errors = require('../helpers/errors');
const prisma = new PrismaClient();

const getRequests = async () => {
    try {
        const requests = await prisma.$queryRaw`SELECT s.id, s.idContrato, c.nombre cliente, b.nombre AS beneficiario, f.nombre AS fallecido, p.nombrePaquete paquete, s.tipo
        FROM solicitudes s
        LEFT JOIN beneficiarios b ON s.idBeneficiario = b.id
        LEFT JOIN fallecidos f ON s.idFallecido = f.id
        LEFT JOIN clientes c ON s.idCliente = c.id
        LEFT JOIN paquetes p ON p.id = s.idPaquete ORDER BY ID DESC`;
        return requests;
    } catch (error) {
        errors.conflictError('Error al obtener las solicitudes', 'GET_REQUESTS_DB', error);
    }
};

const getRequest = async (id) => {
    try {
        const request = await prisma.solicitudes.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return request;
    } catch (error) {
        errors.conflictError('Error al obtener la solicitud', 'GET_REQUEST_DB', error);
    }
};

const createRequest = async (request) => {
    try {
        const newRequest = await prisma.solicitudes.create({
            data: request
        });
        return newRequest;
    } catch (error) {
        errors.conflictError('Error al crear la solicitud', 'CREATE_REQUEST_DB', error);
    }
};

const updateRequest = async (id, request) => {
    try {
        const updatedRequest = await prisma.solicitudes.update({
            where: {
                id: parseInt(id)
            },
            data: request
        });
        return updatedRequest;
    } catch (error) {
        errors.conflictError('Error al actualizar la solicitud', 'UPDATE_REQUEST_DB', error);
    }
};

const deleteRequest = async (id) => {
    try {
        const deletedRequest = await prisma.solicitudes.delete({
            where: {
                id: parseInt(id)
            }
        });
        return deletedRequest;
    } catch (error) {
        errors.conflictError('Error al eliminar la solicitud', 'DELETE_REQUEST_DB', error);
    }
};

const requestsService = {
    getRequests,
    getRequest,
    createRequest,
    updateRequest,
    deleteRequest
};

module.exports = requestsService;

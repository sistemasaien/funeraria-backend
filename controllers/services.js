const servicesService = require('../services/services')
const errors = require('../helpers/errors')

const getServices = async (req, res, next) => {
    try {
        const services = await servicesService.getServices()
        res.status(200).json(services)
    } catch (error) {
        next(error);
    }
}

const getService = async (req, res, next) => {
    const { id } = req.params;
    try {
        const service = await servicesService.getService(id)
        if (!service) {
            errors.notFoundError('Servicio no encontrado', 'SERVICE_NOT_FOUND')
        }
        res.status(200).json(service)
    } catch (error) {
        next(error);
    }
}

const updateService = async (req, res, next) => {
    const { id, embalsamado, urna, especial, encapsulado, nocheAdicional, cremacion, extra } = req.body;
    const service = { id, embalsamado, urna, especial, encapsulado, nocheAdicional, cremacion, extra };
    try {

        const serviceToUpdate = await servicesService.getService(id)
        if (!serviceToUpdate) {
            errors.notFoundError('Servicio no encontrado', 'SERVICE_NOT_FOUND')
        }

        const updatedService = await servicesService.updateService(id, service)
        res.status(200).json(updatedService)
    } catch (error) {
        next(error);
    }
}

const createService = async (req, res, next) => {
    const { embalsamado, urna, especial, encapsulado, nocheAdicional, cremacion, extra } = req.body;
    const service = { embalsamado, urna, especial, encapsulado, nocheAdicional, cremacion, extra };
    try {
        const newService = await servicesService.createService(service)
        res.status(200).json(newService)
    } catch (error) {
        next(error);
    }
}

const deleteService = async (req, res, next) => {
    const { id } = req.body;
    try {
        const serviceToDelete = await servicesService.getService(id)
        if (!serviceToDelete) {
            errors.notFoundError('Servicio no encontrado', 'SERVICE_NOT_FOUND')
        }

        const deletedService = await servicesService.deleteService(id)
        res.status(200).json(deletedService)
    } catch (error) {
        next(error);
    }
}

const servicesController = {
    getServices,
    getService,
    updateService,
    createService,
    deleteService
}

module.exports = servicesController;
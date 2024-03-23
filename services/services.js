const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getServices = async () => {
    try {
        const services = await prisma.servicios.findMany()
        return services
    } catch (error) {
        errors.conflictError('Error al obtener los servicios', 'GET_SERVICES_DB', error)
    }
}

const getService = async (id) => {
    try {
        const service = await prisma.servicios.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return service
    } catch (error) {
        errors.conflictError('Error al obtener el servicio', 'GET_SERVICE_DB', error)
    }
}

const createService = async (service) => {
    try {
        const newService = await prisma.servicios.create({
            data: service
        })
        return newService
    } catch (error) {
        errors.conflictError('Error al crear el servicio', 'CREATE_SERVICE_DB', error)
    }
}

const updateService = async (id, service) => {
    try {
        const updatedService = await prisma.servicios.update({
            where: {
                id: parseInt(id)
            },
            data: service
        })
        return updatedService
    } catch (error) {
        errors.conflictError('Error al actualizar el servicio', 'UPDATE_SERVICE_DB', error)
    }
}

const deleteService = async (id) => {
    try {
        const deletedService = await prisma.servicios.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedService
    } catch (error) {
        errors.conflictError('Error al eliminar el servicio', 'DELETE_SERVICE_DB', error)
    }
}

const servicesService = {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
}

module.exports = servicesService;
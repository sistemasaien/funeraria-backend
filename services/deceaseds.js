const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getDeceaseds = async () => {
    try {
        const deceaseds = await prisma.fallecidos.findMany()
        return deceaseds
    } catch (error) {
        errors.conflictError('Error al obtener los fallecidos', 'GET_DECEASEDS_DB', error)
    }
}

const getDeceased = async (id) => {
    try {
        const deceased = await prisma.fallecidos.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return deceased
    } catch (error) {
        errors.conflictError('Error al obtener el fallecido', 'GET_DECEASED_DB', error)
    }
}

const createDeceased = async (deceased) => {
    try {
        const newDeceased = await prisma.fallecidos.create({
            data: deceased
        })
        return newDeceased
    } catch (error) {
        errors.conflictError('Error al crear el fallecido', 'CREATE_DECEASED_DB', error)
    }
}

const updateDeceased = async (id, deceased) => {
    try {
        const updatedDeceased = await prisma.fallecidos.update({
            where: {
                id: parseInt(id)
            },
            data: deceased
        })
        return updatedDeceased
    } catch (error) {
        errors.conflictError('Error al actualizar el fallecido', 'UPDATE_DECEASED_DB', error)
    }
}

const deleteDeceased = async (id) => {
    try {
        const deletedDeceased = await prisma.fallecidos.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedDeceased
    } catch (error) {
        errors.conflictError('Error al eliminar el fallecido', 'DELETE_DECEASED_DB', error)
    }
}

const deceasedsService = {
    getDeceaseds,
    getDeceased,
    createDeceased,
    updateDeceased,
    deleteDeceased
}

module.exports = deceasedsService;
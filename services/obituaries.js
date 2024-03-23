const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getObituaries = async () => {
    try {
        const obituaries = await prisma.esquelas.findMany()
        return obituaries
    } catch (error) {
        errors.conflictError('Error al obtener las esquelas', 'GET_OBITUARIES_DB', error)
    }
}

const getObituary = async (id) => {
    try {
        const obituary = await prisma.esquelas.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return obituary
    } catch (error) {
        errors.conflictError('Error al obtener la esquela', 'GET_OBITUARY_DB', error)
    }
}

const createObituary = async (obituary) => {
    try {
        const newObituary = await prisma.esquelas.create({
            data: obituary
        })
        return newObituary
    } catch (error) {
        errors.conflictError('Error al crear la esquela', 'CREATE_OBITUARY_DB', error)
    }
}

const updateObituary = async (id, obituary) => {
    try {
        const updatedObituary = await prisma.esquelas.update({
            where: {
                id: parseInt(id)
            },
            data: obituary
        })
        return updatedObituary
    } catch (error) {
        errors.conflictError('Error al actualizar la esquela', 'UPDATE_OBITUARY_DB', error)
    }
}

const deleteObituary = async (id) => {
    try {
        const deletedObituary = await prisma.esquelas.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedObituary
    } catch (error) {
        errors.conflictError('Error al eliminar la esquela', 'DELETE_OBITUARY_DB', error)
    }
}

const obituariesService = {
    getObituaries,
    getObituary,
    createObituary,
    updateObituary,
    deleteObituary
}

module.exports = obituariesService;
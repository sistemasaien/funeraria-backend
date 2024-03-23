const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getFinancings = async () => {
    try {
        const financings = await prisma.financiamientos.findMany()
        return financings
    } catch (error) {
        errors.conflictError('Error al obtener los financiamientos', 'GET_FINANCINGS_DB', error)
    }
}

const getCompleteFinancings = async () => {
    try {
        const financings = await prisma.$queryRaw`SELECT f.id, f.idContrato, c.nombre as cliente, f.importeTotal, f.numeroPagos, f.importeCuota, f.importePendiente  FROM financiamientos f
        left join clientes c ON f.idCliente = c.id`
        return financings
    } catch (error) {
        errors.conflictError('Error al obtener los financiamientos', 'GET_COMPLETE_FINANCINGS_DB', error)
    }
}

const getFinancing = async (id) => {
    try {
        const financing = await prisma.financiamientos.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return financing
    } catch (error) {
        errors.conflictError('Error al obtener el financiamiento', 'GET_FINANCING_DB', error)
    }
}

const createFinancing = async (financing) => {
    try {
        const newFinancing = await prisma.financiamientos.create({
            data: financing
        })
        return newFinancing
    } catch (error) {
        errors.conflictError('Error al crear el financiamiento', 'CREATE_FINANCING_DB', error)
    }
}

const updateFinancing = async (id, financing) => {
    try {
        const updatedFinancing = await prisma.financiamientos.update({
            where: {
                id: parseInt(id)
            },
            data: financing
        })
        return updatedFinancing
    } catch (error) {
        errors.conflictError('Error al actualizar el financiamiento', 'UPDATE_FINANCING_DB', error)
    }
}

const deleteFinancing = async (id) => {
    try {
        const deletedFinancing = await prisma.financiamientos.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedFinancing
    } catch (error) {
        errors.conflictError('Error al eliminar el financiamiento', 'DELETE_FINANCING_DB', error)
    }
}

const updateFinancingByContract = async (idContrato, financing) => {
    try {
        const updatedFinancing = await prisma.financiamientos.update({
            where: {
                idContrato: parseInt(idContrato)
            },
            data: financing
        })
        return updatedFinancing
    } catch (error) {
        errors.conflictError('Error al actualizar el financiamiento', 'UPDATE_FINANCING_BY_CONTRACT_DB', error)
    }
}

const getFinancingByContract = async (idContrato) => {
    try {
        const financing = await prisma.financiamientos.findFirst({
            where: {
                idContrato: parseInt(idContrato)
            }
        })
        return financing
    } catch (error) {
        errors.conflictError('Error al obtener el financiamiento', 'GET_FINANCING_BY_CONTRACT_DB', error)
    }
}

const financingsService = {
    getFinancings,
    getCompleteFinancings,
    getFinancing,
    createFinancing,
    updateFinancing,
    deleteFinancing,
    updateFinancingByContract,
    getFinancingByContract
}

module.exports = financingsService;
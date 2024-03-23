const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const updateContractNumber = async ({ id, tableName, contractNumber }) => {
    try {
        const updatedRegister = await prisma.$queryRaw(`UPDATE ${tableName} SET idContrato = ${contractNumber} WHERE id = ${id}`);
        return updatedRegister
    } catch (error) {
        errors.conflictError(`Error al actualizar el número de contrato en la tabla ${tableName}`, 'UPDATE_CONTRACT_NUMBER_DB', error)
    }
}

const genericQuery = async (query) => {
    try {
        const result = await prisma.$queryRaw`${query}`
        return result
    } catch (error) {
        errors.conflictError('Error al ejecutar la consulta genérica', 'GENERIC_QUERY_DB', error)
    }
}

const getAllData = async (id) => {
    try {
        const result = await prisma.$queryRaw`select * from vw_ventas_completas where venta_id = ${id};`
        return result
    } catch (error) {
        errors.conflictError('Error al ejecutar la consulta genérica', 'GENERIC_QUERY_DB', error)
    }
}

const genericsService = {
    updateContractNumber,
    genericQuery,
    getAllData
}

module.exports = genericsService
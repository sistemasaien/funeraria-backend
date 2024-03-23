const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getContracts = async () => {
    try {
        const contracts = await prisma.$queryRaw`
        SELECT c.id, cl.nombre as cliente, c.idFinanciamiento, c.idSolicitud, p.nombrePaquete as paquete, e.nombre as asesor, c.fecha, c.tipo, c.estado FROM contratos c
        LEFT JOIN clientes cl ON c.idCliente = cl.id
        LEFT JOIN paquetes p ON c.idPaquete = p.id
        LEFT JOIN empleados e ON c.asesor = e.id
        ORDER BY ID DESC`
        return contracts
    } catch (error) {
        errors.conflictError('Error al obtener los contratos', 'GET_CONTRACTS_DB', error)
    }
}

const getContract = async (id) => {
    try {
        const contract = await prisma.contratos.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return contract
    } catch (error) {
        errors.conflictError('Error al obtener el contrato', 'GET_CONTRACT_DB', error)
    }
}

const getCompleteContract = async (id) => {
    try {
        const contract = await prisma.$queryRaw`SELECT con.*, cl.*, sol.*, ser.*
            FROM contratos con
            LEFT JOIN clientes cl ON con.idCliente = cl.id
            LEFT JOIN solicitudes sol ON con.idSolicitud = sol.id
            LEFT JOIN servicios ser ON sol.idServicio = ser.id
            WHERE con.id = ${id}`
        return contract
    } catch (error) {
        errors.conflictError('Error al obtener el contrato', 'GET_COMPLETE_CONTRACT_DB', error)
    }
}


const updateContract = async (id, contract) => {
    try {
        const updatedContract = await prisma.contratos.update({
            where: {
                id: parseInt(id)
            },
            data: contract
        })
        return updatedContract
    } catch (error) {
        errors.conflictError('Error al actualizar el contrato', 'UPDATE_CONTRACT_DB', error)
    }
}

const createContract = async (contract) => {
    try {
        const newContract = await prisma.contratos.create({
            data: contract
        })
        return newContract
    } catch (error) {
        errors.conflictError('Error al crear el contrato', 'CREATE_CONTRACT_DB', error)
    }
}

const deleteContract = async (id) => {
    try {
        const deletedContract = await prisma.contratos.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedContract
    } catch (error) {
        errors.conflictError('Error al eliminar el contrato', 'DELETE_CONTRACT_DB', error)
    }
}

const contractsService = {
    getContracts,
    getContract,
    updateContract,
    getCompleteContract,
    createContract,
    deleteContract
}

module.exports = contractsService
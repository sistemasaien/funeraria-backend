const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getBeneficiaries = async () => {
    try {
        const beneficiaries = await prisma.beneficiarios.findMany()
        return beneficiaries
    } catch (error) {
        errors.conflictError('Error al obtener los beneficiarios', 'GET_BENEFICIARIES_DB', error)
    }
}

const getBeneficiary = async (id) => {
    try {
        const beneficiary = await prisma.beneficiarios.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return beneficiary
    } catch (error) {
        errors.conflictError('Error al obtener el beneficiario', 'GET_BENEFICIARIES_DB', error)
    }
}

const createBeneficiary = async (beneficiary) => {
    try {
        const newBeneficiary = await prisma.beneficiarios.create({
            data: beneficiary
        })
        return newBeneficiary
    } catch (error) {
        errors.conflictError('Error al crear el beneficiario', 'CREATE_BENEFICIARIES_DB', error)
    }
}

const updateBeneficiary = async (id, beneficiary) => {
    try {
        const updatedBeneficiary = await prisma.beneficiarios.update({
            where: {
                id: parseInt(id)
            },
            data: beneficiary
        })
        return updatedBeneficiary
    } catch (error) {
        errors.conflictError('Error al actualizar el beneficiario', 'UPDATE_BENEFICIARIES_DB', error)
    }
}

const deleteBeneficiary = async (id) => {
    try {
        const deletedBeneficiary = await prisma.beneficiarios.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedBeneficiary
    } catch (error) {
        errors.conflictError('Error al eliminar el beneficiario', 'DELETE_BENEFICIARIES_DB', error)
    }
}

const beneficiariesService = {
    getBeneficiaries,
    getBeneficiary,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary
}

module.exports = beneficiariesService;
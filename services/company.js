const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getCompanyData = async () => {
    try {
        const companies = await prisma.empresa.findMany()
        return companies[0]
    } catch (error) {
        errors.conflictError('Error al obtener los datos de la empresa', 'GET_COMPANY_DATA_DB', error)
    }
}

const updateCompanyData = async (sentence) => {
    try {
        const updatedCompany = await prisma.$queryRaw`${sentence}`
        return updatedCompany
    } catch (error) {
        errors.conflictError('Error al actualizar los datos de la empresa', 'UPDATE_COMPANY_DATA_DB', error)
    }
}

const createCompanyData = async (sentence) => {
    try {
        const newCompany = await prisma.$queryRaw`${sentence}`
        return newCompany
    } catch (error) {
        errors.conflictError('Error al crear los datos de la empresa', 'CREATE_COMPANY_DATA_DB', error)
    }
}

const companyService = {
    getCompanyData,
    updateCompanyData,
    createCompanyData
}

module.exports = companyService
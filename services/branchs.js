const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getBranchs = async () => {
    try {
        const branchs = await prisma.sucursales.findMany()
        return branchs
    } catch (error) {
        errors.conflictError('Error al obtener las sucursales', 'GET_BRANCHS_DB', error)
    }
}

const getBranch = async (id) => {
    try {
        const branch = await prisma.sucursales.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return branch
    } catch (error) {
        errors.conflictError('Error al obtener la sucursal', 'GET_BRANCH_DB', error)
    }
}

const createBranch = async (branch) => {
    try {
        const newBranch = await prisma.sucursales.create({
            data: branch
        })
        return newBranch
    } catch (error) {
        errors.conflictError('Error al crear la sucursal', 'CREATE_BRANCH_DB', error)
    }
}

const updateBranch = async (id, branch) => {
    try {
        const updatedBranch = await prisma.sucursales.update({
            where: {
                id: parseInt(id)
            },
            data: branch
        })
        return updatedBranch
    } catch (error) {
        errors.conflictError('Error al actualizar la sucursal', 'UPDATE_BRANCH_DB', error)
    }
}

const deleteBranch = async (id) => {
    try {
        const deletedBranch = await prisma.sucursales.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedBranch
    } catch (error) {
        errors.conflictError('Error al eliminar la sucursal', 'DELETE_BRANCH_DB', error)
    }
}

const branchsService = {
    getBranchs,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch
}

module.exports = branchsService;
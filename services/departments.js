const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getDepartments = async () => {
    try {
        const departments = await prisma.departamentos.findMany()
        return departments
    } catch (error) {
        errors.conflictError('Error al obtener los departamentos', 'GET_DEPARTMENTS_DB', error)
    }
}

const getDepartment = async (id) => {
    try {
        const department = await prisma.departamentos.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return department
    } catch (error) {
        errors.conflictError('Error al obtener el departamento', 'GET_DEPARTMENT_DB', error)
    }
}

const createDepartment = async (department) => {
    try {
        const newDepartment = await prisma.departamentos.create({
            data: department
        })
        return newDepartment
    } catch (error) {
        errors.conflictError('Error al crear el departamento', 'CREATE_DEPARTMENT_DB', error)
    }
}

const updateDepartment = async (id, department) => {
    try {
        const updatedDepartment = await prisma.departamentos.update({
            where: {
                id: parseInt(id)
            },
            data: department
        })
        return updatedDepartment
    } catch (error) {
        errors.conflictError('Error al actualizar el departamento', 'UPDATE_DEPARTMENT_DB', error)
    }
}

const deleteDepartment = async (id) => {
    try {
        const deletedDepartment = await prisma.departamentos.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedDepartment
    } catch (error) {
        errors.conflictError('Error al eliminar el departamento', 'DELETE_DEPARTMENT_DB', error)
    }
}

const departmentsService = {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
}

module.exports = departmentsService;
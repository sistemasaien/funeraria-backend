const departmentsService = require('../services/departments')
const errors = require('../helpers/errors')
const departmentSchema = require('../schemas/department')
const validateSchema = require('../helpers/validate')

const getDepartments = async (req, res, next) => {
    try {
        const departments = await departmentsService.getDepartments()
        res.status(200).json(departments)
    } catch (error) {
        next(error);
    }
}

const getDepartment = async (req, res, next) => {
    const { id } = req.params;
    try {
        const department = await departmentsService.getDepartment(id)
        if (!department) {
            errors.notFoundError('Departamento no encontrado', 'DEPARTMENT_NOT_FOUND')
        }
        res.status(200).json(department)
    } catch (error) {
        next(error);
    }
}

const updateDepartment = async (req, res, next) => {

    try {
        await validateSchema(departmentSchema, req.body)
        const { id, nombre, descripcion } = req.body;
        const department = { id, nombre, descripcion };

        const departmentToUpdate = await departmentsService.getDepartment(id)
        if (!departmentToUpdate) {
            errors.notFoundError('Departamento no encontrado', 'DEPARTMENT_NOT_FOUND')
        }

        const updatedDepartment = await departmentsService.updateDepartment(id, department)
        res.status(200).json(updatedDepartment)
    } catch (error) {
        next(error);
    }
}

const createDepartment = async (req, res, next) => {
    try {
        await validateSchema(departmentSchema, req.body)
        const { nombre, descripcion } = req.body;
        const department = { nombre, descripcion };
        const newDepartment = await departmentsService.createDepartment(department)
        res.status(200).json(newDepartment)
    } catch (error) {
        next(error);
    }
}

const deleteDepartment = async (req, res, next) => {
    const { id } = req.body;
    try {
        const departmentToDelete = await departmentsService.getDepartment(id)
        if (!departmentToDelete) {
            errors.notFoundError('Departamento no encontrado', 'DEPARTMENT_NOT_FOUND')
        }

        const deletedDepartment = await departmentsService.deleteDepartment(id)
        res.status(200).json(deletedDepartment)
    } catch (error) {
        next(error);
    }
}

const departmentsController = {
    getDepartments,
    getDepartment,
    updateDepartment,
    createDepartment,
    deleteDepartment
}

module.exports = departmentsController;
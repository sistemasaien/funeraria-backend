const errors = require('../helpers/errors')
const employeesService = require('../services/employees')
const employeeSchema = require('../schemas/employee')
const validateSchema = require('../helpers/validate')

const getEmployees = async (req, res, next) => {
    try {
        const employees = await employeesService.getEmployees()
        res.status(200).json(employees)
    } catch (error) {
        next(error);
    }
}

const getEmployee = async (req, res, next) => {
    const { id } = req.params;
    try {
        const employee = await employeesService.getEmployee(id)
        if (!employee) {
            errors.notFoundError('Empleado no encontrado', 'EMPLOYEE_NOT_FOUND')
        }
        res.status(200).json(employee)
    } catch (error) {
        next(error);
    }
}

const updateEmployee = async (req, res, next) => {
    try {
        await validateSchema(employeeSchema, req.body)
        const { id, idUsuario, nombre, tipo, departamento, sucursal, recorrido, contacto, telefono, telefonoEmergencia } = req.body;
        const employee = { id, idUsuario, nombre, tipo, departamento, sucursal, recorrido, contacto, telefono, telefonoEmergencia };
        const employeeToUpdate = await employeesService.getEmployee(id)
        if (!employeeToUpdate) {
            errors.notFoundError('Empleado no encontrado', 'EMPLOYEE_NOT_FOUND')
        }

        const updatedEmployee = await employeesService.updateEmployee(id, employee)
        res.status(200).json(updatedEmployee)
    } catch (error) {
        next(error);
    }
}

const createEmployee = async (req, res, next) => {
    try {
        await validateSchema(employeeSchema, req.body)
        const { idUsuario, nombre, tipo, departamento, sucursal, recorrido, contacto, telefono, telefonoEmergencia } = req.body;
        const employee = { idUsuario, nombre, tipo, departamento, sucursal, recorrido, contacto, telefono, telefonoEmergencia };
        employee.departamento = employee.departamento ? employee.departamento.toString() : ''
        employee.sucursal = employee.sucursal ? employee.sucursal.toString() : ''
        const newEmployee = await employeesService.createEmployee(employee)
        res.status(200).json(newEmployee)
    } catch (error) {
        next(error);
    }
}

const deleteEmployee = async (req, res, next) => {
    const { id } = req.body;
    try {
        const employeeToDelete = await employeesService.getEmployee(id)
        if (!employeeToDelete) {
            errors.notFoundError('Empleado no encontrado', 'EMPLOYEE_NOT_FOUND')
        }
        const deletedEmployee = await employeesService.deleteEmployee(id)
        res.status(200).json(deletedEmployee)
    } catch (error) {
        next(error);
    }
}

const updateEmployeesWay = async (req, res, next) => {
    const { ids, way } = req.body;

    const employeesOfWay = await employeesService.getEmployeesOfWay(way)
    const employeesToCreate = ids.filter(id => !employeesOfWay.map(employee => employee.idEmpleado).includes(id));

    const data = employeesToCreate.map(idEmpleado => ({ idEmpleado, idRecorrido: parseInt(way) }))

    try {
        const response = await employeesService.updateEmployeesWay(data)
        res.status(200).json(response)
    } catch (error) {
        next(error);
    }
}

const deleteEmployeeWay = async (req, res, next) => {
    const { id, way } = req.body;
    try {
        const data = {
            idEmpleado: parseInt(id),
            idRecorrido: parseInt(way)
        }
        const response = await employeesService.deleteEmployeeWay(data)
        res.status(200).json(response)
    } catch (error) {
        next(error);
    }
}

const getEmployeeByUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employeesService.getEmployeeByUser(id)
        if (!employee) {
            errors.notFoundError('Empleado no encontrado', 'EMPLOYEE_NOT_FOUND')
        }
        return employee
    } catch (error) {
        next(error);
    }
}

const employeesController = {
    getEmployees,
    getEmployee,
    updateEmployee,
    createEmployee,
    deleteEmployee,
    updateEmployeesWay,
    deleteEmployeeWay,
    getEmployeeByUser
}

module.exports = employeesController;
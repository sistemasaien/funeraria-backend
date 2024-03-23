const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getEmployees = async () => {

    try {
        const employees = await prisma.$queryRaw`SELECT e.*, s.nombre nombreSucursal, d.nombre departamento, r.nombre nombreRecorrido FROM empleados e
        left join sucursales s
        on e.sucursal = s.id
        left join departamentos d
        on e.departamento = d.id
        left join recorridos r
        on e.recorrido = r.id
        `
        return employees
    }
    catch (error) {
        errors.conflictError('Error al obtener los empleados', 'GET_EMPLOYEES_DB', error)
    }

}

const getEmployee = async (id) => {
    try {
        const employee = await prisma.empleados.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return employee
    } catch (error) {
        errors.conflictError('Error al obtener el empleado', 'GET_EMPLOYEE_DB', error)
    }
}

const createEmployee = async (employee) => {
    try {
        const newEmployee = await prisma.empleados.create({
            data: employee
        })
        return newEmployee
    } catch (error) {
        errors.conflictError('Error al crear el empleado', 'CREATE_EMPLOYEE_DB', error)
    }
}

const updateEmployee = async (id, employee) => {
    try {
        const updatedEmployee = await prisma.empleados.update({
            where: {
                id: parseInt(id)
            },
            data: employee
        })
        return updatedEmployee
    } catch (error) {
        errors.conflictError('Error al actualizar el empleado', 'UPDATE_EMPLOYEE_DB', error)
    }
}

const deleteEmployee = async (id) => {
    try {
        const deletedEmployee = await prisma.empleados.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedEmployee
    } catch (error) {
        errors.conflictError('Error al eliminar el empleado', 'DELETE_EMPLOYEE_DB', error)
    }
}

const updateEmployeesWay = async (data) => {
    try {
        const empleados = await prisma.recorridos_empleados.createMany({
            data: data
        });

        return empleados
    } catch (error) {
        errors.conflictError('Error al actualizar el recorrido de los empleados', 'UPDATE_EMPLOYEES_WAY_DB', error)
    }
}

const getEmployeesOfWay = async (id) => {
    try {
        const employeesOfWay = await prisma.recorridos_empleados.findMany({
            where: {
                idRecorrido: parseInt(id)
            }
        });
        return employeesOfWay
    } catch (error) {
        errors.conflictError('Error al obtener los empleados del recorrido', 'GET_EMPLOYEES_WAY_DB', error)
    }
}

const deleteEmployeeWay = async ({ idEmpleado, idRecorrido }) => {
    try {
        const deletedEmployee = await prisma.recorridos_empleados.deleteMany({
            where: {
                AND: [
                    { idEmpleado: parseInt(idEmpleado) },
                    { idRecorrido: parseInt(idRecorrido) }
                ]
            }
        })
        return deletedEmployee
    } catch (error) {
        errors.conflictError('Error al eliminar el empleado del recorrido', 'DELETE_EMPLOYEE_DB', error)
    }
}

const getEmployeeByUser = async (id) => {
    try {
        const employees = await prisma.empleados.findMany({
            where: {
                idUsuario: parseInt(id)
            }
        })
        return employees[0]
    } catch (error) {
        errors.conflictError('Error al obtener el empleado', 'GET_EMPLOYEE_BY_USER_DB', error)
    }
}

const getEmployeesByUser = async (id) => {
    try {
        const employees = await prisma.empleados.findMany({
            where: {
                idUsuario: parseInt(id)
            }
        })
        return employees
    } catch (error) {
        errors.conflictError('Error al obtener los empleados', 'GET_EMPLOYEES_BY_USER_DB', error)
    }
}

const employeesService = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateEmployeesWay,
    deleteEmployeeWay,
    getEmployeesOfWay,
    getEmployeeByUser,
    getEmployeesByUser
}

module.exports = employeesService;

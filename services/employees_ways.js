const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getEmployeesWays = async () => {
    try {
        const employeesWays = await prisma.recorridos_empleados.findMany()
        return employeesWays
    } catch (error) {
        errors.conflictError('Error al obtener las rutas de los empleados', 'GET_EMPLOYEES_WAYS_DB', error)
    }
}

const getEmployeeWays = async (id) => {
    try {
        const employeeWays = await prisma.$queryRaw`
        SELECT re.*, r.nombre from recorridos_empleados re, recorridos r 
        WHERE re.idEmpleado = ${id}
        AND re.idRecorrido = r.id`
        return employeeWays
    } catch (error) {
        errors.conflictError('Error al obtener la ruta del empleado', 'GET_EMPLOYEE_WAYS_DB', error)
    }
}

const createEmployeeWay = async (employeeWay) => {
    try {
        const newEmployeeWay = await prisma.recorridos_empleados.create({
            data: employeeWay
        })
        return newEmployeeWay
    } catch (error) {
        errors.conflictError('Error al crear la ruta del empleado', 'CREATE_EMPLOYEE_WAY_DB', error)
    }
}

const updateEmployeeWay = async (id, employeeWay) => {
    try {
        const updatedEmployeeWay = await prisma.recorridos_empleados.update({
            where: {
                id: parseInt(id)
            },
            data: employeeWay
        })
        return updatedEmployeeWay
    } catch (error) {
        errors.conflictError('Error al actualizar la ruta del empleado', 'UPDATE_EMPLOYEE_WAY_DB', error)
    }
}

const deleteEmployeeWay = async (id) => {
    try {
        const deletedEmployeeWay = await prisma.recorridos_empleados.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedEmployeeWay
    } catch (error) {
        errors.conflictError('Error al eliminar la ruta del empleado', 'DELETE_EMPLOYEE_WAY_DB', error)
    }
}

module.exports = {
    getEmployeesWays,
    getEmployeeWays,
    createEmployeeWay,
    updateEmployeeWay,
    deleteEmployeeWay
}
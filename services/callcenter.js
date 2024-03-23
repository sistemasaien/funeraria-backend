const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getCalls = async () => {
    try {
        const calls = await prisma.$queryRaw`
        SELECT c.*, DATE(c.fecha) as fechaParsed, TIME(c.fecha) as horaParsed, e.nombre as nombreEmpleado, s.nombre as nombreSucursal
        FROM callcenter c
        LEFT JOIN empleados e ON e.id = c.idEmpleado
        LEFT JOIN sucursales s ON s.id = c.idSucursal`
        return calls
    } catch (error) {
        errors.conflictError('Error al obtener las llamadas', 'GET_CALLS_DB', error)
    }
}

const createCall = async (call) => {
    try {
        const newCall = await prisma.callcenter.create({
            data: call
        })
        return newCall
    } catch (error) {
        errors.conflictError('Error al crear la llamada', 'CREATE_CALL_DB', error)
    }
}

const getCallsByEmployee = async (id) => {
    try {
        const calls = await prisma.callcenter.findMany({
            where: {
                idEmpleado: parseInt(id)
            }
        })
        return calls
    } catch (error) {
        errors.conflictError('Error al obtener las llamadas', 'GET_CALLS_BY_EMPLOYEE_DB', error)
    }
}

const getCallsByEmployeeAndType = async (id, type) => {
    try {
        const calls = await prisma.callcenter.findMany({
            where: {
                idEmpleado: parseInt(id),
                tipoLlamada: type
            }
        })
        return calls
    } catch (error) {
        errors.conflictError('Error al obtener las llamadas', 'GET_CALLS_BY_EMPLOYEE_AND_TYPE_DB', error)
    }
}

const callcenterService = {
    getCalls,
    createCall,
    getCallsByEmployee,
    getCallsByEmployeeAndType
}

module.exports = callcenterService
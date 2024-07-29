const { PrismaClient } = require('@prisma/client');
const errors = require('../helpers/errors');
const prisma = new PrismaClient();

const createPayrollEmployeeDetail = async (data) => {
    try {
        const newPayrollEmployeeDetail = await prisma.nominas_empleados_detalle.create({
            data: data
        });
        return newPayrollEmployeeDetail;
    } catch (error) {
        errors.conflictError('Error al crear el detalle de nómina para el empleado', 'CREATE_PAYROLL_EMPLOYEE_DETAIL_DB', error);
    }
};

const getSumOfPayrollsDetailByEmployeeAndContract = async (employeeId, contractId) => {
    try {
        const sumOfPayrollsDetail = await prisma.$queryRaw`
        SELECT SUM(monto) as total
        FROM nominas_empleados_detalle
        WHERE idEmpleado = ${employeeId}
        AND idContrato = ${contractId}
        `;
        return sumOfPayrollsDetail;
    } catch (error) {
        errors.conflictError('Error al obtener el total de nómina para el empleado', 'GET_SUM_OF_PAYROLLS_DETAIL_BY_EMPLOYEE_AND_CONTRACT_DB', error);
    }
}

const getPayrollDetailsByEmployeeSinceDate = async (employeeId, date) => {
    try {
        const payrollDetails = await prisma.nominas_empleados_detalle.findMany({
            where: {
                idEmpleado: parseInt(employeeId),
                fecha_hora: {
                    gte: date
                }
            }
        });
        return payrollDetails;
    } catch (error) {
        errors.conflictError('Error al obtener los detalles de nómina para el empleado', 'GET_PAYROLL_DETAILS_BY_EMPLOYEE_SINCE_DATE_DB', error);
    }
}

const getPayrollById = async (id) => {
    try {
        const payroll = await prisma.$queryRaw`SELECT * FROM nominas_impresas WHERE id = ${id}`
        return payroll;
    } catch (error) {
        errors.conflictError('Error al obtener la nómina', 'GET_PAYROLL_BY_ID_DB', error);
    }
}

const getPayrollDetailsById = async (id) => {
    try {
        const payrollDetails = await prisma.nominas_impresas_detalle.findMany({
            where: {
                id_nomina: parseInt(id)
            }
        });
        return payrollDetails;
    } catch (error) {
        errors.conflictError('Error al obtener los detalles de nómina', 'GET_PAYROLL_DETAILS_BY_ID_DB', error);
    }
}

const getPayrollsByEmployee = async (employeeId) => {
    try {
        const payrolls = await prisma.nominas_impresas.findMany({
            where: {
                idEmpleado: parseInt(employeeId)
            }
        });
        return payrolls;
    } catch (error) {
        errors.conflictError('Error al obtener las nóminas del empleado', 'GET_PAYROLLS_BY_EMPLOYEE_DB', error);
    }
}

const createPayroll = async (payroll) => {
    try {
        const newPayroll = await prisma.nominas_impresas.create({
            data: payroll
        });
        return newPayroll;
    } catch (error) {
        errors.conflictError('Error al crear la nómina', 'CREATE_PAYROLL_DB', error);
    }
}

const createPayrollDetail = async (payrollDetail) => {
    try {
        const newPayrollDetail = await prisma.nominas_impresas_detalle.createMany({
            data: payrollDetail
        });
        return newPayrollDetail;
    } catch (error) {
        errors.conflictError('Error al crear el detalle de nómina', 'CREATE_PAYROLL_DETAIL_DB', error);
    }
}

const getPayrollDetailsByEmployee = async (employeeId) => {
    try {
        const payrollDetails = await prisma.nominas_empleados_detalle.findMany({
            where: {
                idEmpleado: parseInt(employeeId)
            }
        });
        return payrollDetails;
    } catch (error) {
        errors.conflictError('Error al obtener los detalles de nómina', 'GET_PAYROLL_DETAILS_BY_EMPLOYEE_DB', error);
    }
}

const getUnprocessedPayrolls = async (employeeId) => {
    try {
        const unprocessedPayrolls = await prisma.nominas_empleados_detalle.findMany({
            where: {
                idEmpleado: parseInt(employeeId),
                procesado: {
                    in: ['N', null]
                }
            }
        });
        return unprocessedPayrolls;
    } catch (error) {
        errors.conflictError('Error al obtener las nóminas no procesadas', 'GET_UNPROCESSED_PAYROLLS_DB', error);
    }
}

const updatePayrollsToProcessed = async (ids) => {
    try {
        const updatedPayrolls = await prisma.nominas_empleados_detalle.updateMany({
            where: {
                id: {
                    in: ids
                }
            },
            data: {
                procesado: 'S'
            }
        });
        return updatedPayrolls;
    } catch (error) {
        errors.conflictError('Error al actualizar las nóminas a procesadas', 'UPDATE_PAYROLLS_TO_PROCESSED_DB', error);
    }
}

const payrollsService = {
    createPayrollEmployeeDetail,
    getSumOfPayrollsDetailByEmployeeAndContract,
    getPayrollDetailsByEmployeeSinceDate,
    getPayrollById,
    getPayrollDetailsById,
    getPayrollsByEmployee,
    createPayroll,
    createPayrollDetail,
    getPayrollDetailsByEmployee,
    getUnprocessedPayrolls,
    updatePayrollsToProcessed
};

module.exports = payrollsService;
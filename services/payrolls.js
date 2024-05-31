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


const payrollsService = {
    createPayrollEmployeeDetail,
    getSumOfPayrollsDetailByEmployeeAndContract
};

module.exports = payrollsService;
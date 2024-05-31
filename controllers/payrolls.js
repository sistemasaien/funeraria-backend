const payrollsService = require('../services/payrolls')
const payrollProfilesService = require('../services/payroll_profiles')
const errors = require('../helpers/errors');
const employeesService = require('../services/employees');

const createPayrollEmployeeDetail = async ({ idEmpleado, fecha, tipo, monto, idPaquete, idContrato }) => {
    try {
        let payrollDetailValue = 0;
        let employee = await employeesService.getEmployee(idEmpleado);
        if (!employee) {
            errors.notFoundError('Empleado no encontrado', 'EMPLOYEE_NOT_FOUND')
        }
        let payrollProfile = await payrollProfilesService.getPayrollProfile(parseInt(employee.perfilNomina));
        if (!payrollProfile) {
            errors.notFoundError('Perfil de nómina no encontrado', 'PAYROLL_PROFILE_NOT_FOUND')
        }

        let payrollProfilePack = await payrollProfilesService.getPayrollByProfileAndPack(parseInt(employee.perfilNomina), parseInt(idPaquete));
        let sumOfPayrollsDetail = await payrollsService.getSumOfPayrollsDetailByEmployeeAndContract(idEmpleado, idContrato);
        if (sumOfPayrollsDetail > parseFloat(payrollProfile.comision)) {
            return;
        }

        let porcentaje = 0;
        if (payrollProfilePack && payrollProfilePack.porcentaje) {
            porcentaje = parseFloat(payrollProfilePack.porcentaje);
        } else {
            if (payrollProfile.porcentajeBase) {
                porcentaje = parseFloat(payrollProfile.porcentajeBase);
            }
        }
        let montoFijo = 0;
        if (payrollProfilePack && payrollProfilePack.montoFijo) {
            montoFijo = parseFloat(payrollProfilePack.montoFijo);
        }

        if (tipo === 'C') {
            if (payrollProfile.tipo === 'V') {
                payrollDetailValue = monto * (porcentaje / 100)
            }
            if (payrollProfile.tipo === 'F') {
                payrollDetailValue = montoFijo
            }

            if ((sumOfPayrollsDetail + payrollDetailValue) > parseFloat(payrollProfile.comision)) {
                payrollDetailValue = parseFloat(payrollProfile.comision) - sumOfPayrollsDetail;
            }
        } else {
            let porcentajeEnganche = 0;

            if (payrollProfilePack && payrollProfilePack.porcentajeEnganche) {
                porcentajeEnganche = parseFloat(payrollProfilePack.porcentajeEnganche);
            } else {
                if (payrollProfile.porcentajeEngancheBase) {
                    porcentajeEnganche = parseFloat(payrollProfile.porcentajeEngancheBase);
                }
            }
            let montoEnganche = 0;
            if (payrollProfilePack && payrollProfilePack.montoFijoEnganche) {
                montoEnganche = parseFloat(payrollProfilePack.montoFijoEnganche);
            }

            if (payrollProfile.tipo === 'V') {
                payrollDetailValue = monto * (porcentajeEnganche / 100)
            } else {
                payrollDetailValue = montoEnganche
            }
        }

        let payrollEmployeeDetail = {
            idEmpleado,
            fecha_hora: fecha,
            tipo,
            monto: payrollDetailValue,
            idPaquete,
            idContrato
        }

        const newPayrollEmployeeDetail = await payrollsService.createPayrollEmployeeDetail(payrollEmployeeDetail)
    } catch (error) {
        console.log(error)
    }
}


const payrollsController = {
    createPayrollEmployeeDetail
}

module.exports = payrollsController;
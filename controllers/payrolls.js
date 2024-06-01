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

const getPayrollDetailsByEmployeeSinceDate = async (req, res, next) => {
    const { idEmpleado, fecha } = req.body;
    try {
        const payrollDetails = await payrollsService.getPayrollDetailsByEmployeeSinceDate(idEmpleado, fecha)
        res.status(200).json(payrollDetails)
    } catch (error) {
        next(error);
    }
}

const getPayrollsByEmployee = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payrolls = await payrollsService.getPayrollsByEmployee(id)
        res.status(200).json(payrolls)
    } catch (error) {
        next(error);
    }
}

const getPayrollById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payroll = await payrollsService.getPayrollById(id)
        res.status(200).json(payroll)
    } catch (error) {
        next(error);
    }
}

const getPayrollDetailsById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payrollDetails = await payrollsService.getPayrollDetailsById(id)
        res.status(200).json(payrollDetails)
    } catch (error) {
        next(error);
    }
}

const createPayroll = async (req, res, next) => {
    try {
        const { idEmpleado } = req.body;

        const employee = await employeesService.getEmployee(idEmpleado);
        if (!employee) errors.notFoundError('Empleado no encontrado', 'EMPLOYEE_NOT_FOUND')
        if (!employee.perfilNomina) errors.notFoundError('Perfil de nómina no encontrado', 'PAYROLL_PROFILE_NOT_FOUND')

        const payrollProfile = await payrollProfilesService.getPayrollProfile(parseInt(employee.perfilNomina));
        let payrollDetailsSinceDate = []
        const lastPayment = employee.ultimoPago;

        if (lastPayment) {
            payrollDetailsSinceDate = await payrollsService.getPayrollDetailsByEmployeeSinceDate(idEmpleado, lastPayment)
        } else {
            payrollDetailsSinceDate = await payrollsService.getPayrollDetailsByEmployee(idEmpleado)
        }

        const period = payrollProfile.periodicidad;
        const salary = payrollProfile.sueldoBase;
        let totalSalary = 0;
        let total = 0;
        let totalComission = 0;

        if (lastPayment) {
            const lastPaymentDate = new Date(lastPayment);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - lastPaymentDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (period === 'D') {
                totalSalary = salary * diffDays;
            } else if (period === 'S') {
                totalSalary = salary * (diffDays / 7);
            } else if (period === 'C') {
                totalSalary = salary * (diffDays / 14);
            } else if (period === 'Q') {
                totalSalary = salary * (diffDays / 15);
            } else if (period === 'M') {
                totalSalary = salary;
            }
        } else {
            totalSalary = salary;
        }
        totalSalary = parseFloat(totalSalary);

        totalComission = payrollDetailsSinceDate.reduce((acc, payroll) => {
            return acc + parseFloat(payroll.monto);
        }, 0);

        total = totalSalary + totalComission;

        const payroll = {
            idEmpleado: parseInt(idEmpleado),
            fecha: new Date(),
            fechaAnterior: lastPayment,
            total,
            periodicidad: period,
        }

        const newPayroll = await payrollsService.createPayroll(payroll)

        let payrollDetails = [];
        let i = 1;
        payrollDetailsSinceDate.forEach(payrollDetail => {
            payrollDetails.push({
                id_nomina: newPayroll.id,
                ordinal: i,
                monto: payrollDetail.monto,
                tipo: payrollDetail.tipo,
                fecha_hora: payrollDetail.fecha_hora,
                idContrato: payrollDetail.idContrato,
                idPaquete: payrollDetail.idPaquete
            })
            i++;
        });

        await payrollsService.createPayrollDetail(payrollDetails)

        //Update employee last payment
        let newEmployee = {
            ...employee,
            ultimoPago: new Date()
        }

        await employeesService.updateEmployee(idEmpleado, newEmployee)

        res.status(200).json(newPayroll)
    } catch (error) {
        next(error);
    }
}

const payrollsController = {
    createPayrollEmployeeDetail,
    getPayrollDetailsByEmployeeSinceDate,
    getPayrollDetailsById,
    getPayrollById,
    createPayroll,
    getPayrollsByEmployee
}

module.exports = payrollsController;
const paymentsService = require('../services/payments')
const errors = require('../helpers/errors')
const financingsService = require('../services/financings')
const contractsService = require('../services/contracts')
const { addDays } = require('../utils/dateUtils')
const payrollsController = require('./payrolls')

const getPayments = async (req, res, next) => {
    try {
        const payments = await paymentsService.getPayments()
        res.status(200).json(payments)
    } catch (error) {
        next(error);
    }
}

const getPayment = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payment = await paymentsService.getPayment(id)
        if (!payment) {
            errors.notFoundError('Pago no encontrado', 'PAYMENT_NOT_FOUND')
        }
        res.status(200).json(payment)
    } catch (error) {
        next(error);
    }
}

const updatePayment = async (req, res, next) => {
    try {
        //await validateSchema(paymentSchema, req.body)
        const { id, amount, method, date } = req.body;
        const payment = { id, amount, method, date };

        const paymentToUpdate = await paymentsService.getPayment(id)
        if (!paymentToUpdate) {
            errors.notFoundError('Pago no encontrado', 'PAYMENT_NOT_FOUND')
        }

        const updatedPayment = await paymentsService.updatePayment(id, payment)
        res.status(200).json(updatedPayment)
    } catch (error) {
        next(error);
    }
}

const createPaymentUtil = async ({ id, fecha, valor, importePago, observacion, importePendiente, idContrato, importeAbonado, atraso, idEmpleado }) => {
    let importePendienteCuota = valor - importePago;
    if (importePendienteCuota < 0) importePendienteCuota = 0;
    let nuevoImportePendiente = importePendiente - importePago;
    if (nuevoImportePendiente < 0) nuevoImportePendiente = 0;
    let nuevoImporteAbonado = importeAbonado + importePago;

    const paymentToUpdate = {
        id,
        fechaPago: new Date(fecha),
        importePago,
        observaciones: observacion,
        importePendiente: importePendienteCuota,
        estado: 'Pagado'
    }

    let nuevoAtraso = 0;
    if (importePago < valor) {
        nuevoAtraso = atraso + (valor - importePago);
    } else if (importePago > valor) {
        nuevoAtraso = atraso - (importePago - valor);
    } else {
        nuevoAtraso = atraso;
    }

    let financingToUpdate = {
        importeAbonado: nuevoImporteAbonado,
        importePendiente: nuevoImportePendiente,
        atraso: nuevoAtraso,
        fechaUltimoPago: new Date(fecha),
        idContrato
    }

    let contract = await contractsService.getContract(idContrato)
    if (importePago >= importePendiente) {
        contract.estado = 'Pagado';
        contract.fechaPago = new Date(fecha);
        await contractsService.updateContract(contract.id, contract)
    }

    let newPayroll = {
        idEmpleado: idEmpleado,
        fecha: new Date(fecha),
        tipo: 'C',
        monto: importePago,
        idPaquete: contract.idPaquete,
        idContrato: contract.id
    }

    await payrollsController.createPayrollEmployeeDetail(newPayroll)
    await paymentsService.updatePayment(id, paymentToUpdate)
    await financingsService.updateFinancing(contract.idFinanciamiento, financingToUpdate)
}

const createPayment = async (req, res, next) => {
    try {
        const { id, fecha, valor, importePago, observacion, importePendiente, idContrato, importeAbonado, atraso, idEmpleado } = req.body;
        await createPaymentUtil({ id, fecha, valor, importePago, observacion, importePendiente, idContrato, importeAbonado, atraso, idEmpleado })
        res.status(200).send({ message: 'Pago realizado correctamente', success: true });
    } catch (error) {
        next(error);
    }
}

const deletePayment = async (req, res, next) => {
    const { id } = req.body;
    try {
        const paymentToDelete = await paymentsService.getPayment(id)
        if (!paymentToDelete) {
            errors.notFoundError('Pago no encontrado', 'PAYMENT_NOT_FOUND')
        }

        const deletedPayment = await paymentsService.deletePayment(id)
        res.status(200).json(deletedPayment)
    } catch (error) {
        next(error);
    }
}

const getPaymentsOfFinancing = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payments = await paymentsService.getPaymentsOfFinancing(id)
        res.status(200).json(payments)
    } catch (error) {
        next(error);
    }
}

const getLastPendingPayment = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payment = await paymentsService.getLastPendingPayment(id)
        res.status(200).json(payment)
    } catch (error) {
        next(error);
    }
}

const deletePaymentsOfFinancing = async (req, res, next) => {
    const { id } = req.body;
    try {
        const paymentsToDelete = await paymentsService.getPaymentsOfFinancing(id)
        if (!paymentsToDelete) {
            errors.notFoundError('Pagos no encontrados', 'PAYMENTS_NOT_FOUND')
        }

        const deletedPayments = await paymentsService.deletePaymentsOfFinancing(id)
        res.status(200).json(deletedPayments)
    } catch (error) {
        next(error);
    }
}

const getPaymentsForMassivePayment = ({ idFinanciamiento, nroCuotas, importeCuota, enganche, fechaPrimerCuota, periodo, montoUltimaCuota, adelanto, fechaInicio, tipo, importeAbonado }) => {
    let cuotasPagas = 0;
    let nroCuotaIncompleta = 0;
    let importeRestante = importeAbonado;
    let importePagado = 0;
    if (importeAbonado > 0) {
        if (importeAbonado < importeCuota) {
            cuotasPagas = 1;
            importeRestante = importeCuota - importeAbonado;
            nroCuotaIncompleta = 1;
            importePagado = importeAbonado;
        } else {
            //int without decimals
            cuotasPagas = Math.trunc(importeAbonado / importeCuota);
            let resto = importeAbonado % importeCuota;
            if (resto > 0) {
                cuotasPagas = cuotasPagas + 1;
                nroCuotaIncompleta = cuotasPagas;
                importeRestante = importeCuota - resto;
                importePagado = resto;
            }
        }
    }

    let payments = [];
    let actualDate = null;
    actualDate = fechaPrimerCuota;
    if (enganche) {
        let payment = {
            idFinanciamiento,
            nroCuota: 0,
            fecha: fechaInicio,
            valor: enganche,
            tipo: 'Enganche',
            descripcion: 'Enganche',
            estado: 'Pagado',
            importePago: enganche,
            importePendiente: 0
        }
        payments.push(payment);
    }
    if (adelanto) {
        let payment = {
            idFinanciamiento,
            nroCuota: 0,
            fecha: fechaInicio,
            valor: adelanto,
            tipo: 'Adelanto',
            descripcion: 'Adelanto',
            estado: 'Pagado',
            importePago: adelanto,
            importePendiente: 0
        }
        payments.push(payment);
    }

    if (tipo === 'Crédito') {
        for (let i = 0; i < nroCuotas; i++) {
            let cuota = i + 1;
            if (i !== 0) {
                actualDate = addDays(fechaPrimerCuota, periodo * cuota);
            } else {
                actualDate = fechaPrimerCuota;
            }
            actualDate = new Date(actualDate);
            let tipo = 'Cuota';
            if (i + 1 === nroCuotas && montoUltimaCuota) {
                if (cuota <= cuotasPagas) {
                    if (nroCuotaIncompleta === i + 1) {
                        let payment = {
                            idFinanciamiento,
                            nroCuota: cuota,
                            fecha: actualDate,
                            valor: nroCuotaIncompleta,
                            tipo: tipo,
                            descripcion: `Cuota ${cuota}/${nroCuotas}`,
                            estado: 'Pagado',
                            importePago: importePagado,
                            importePendiente: importeRestante
                        }
                        payments.push(payment);
                    } else {
                        let payment = {
                            idFinanciamiento,
                            nroCuota: cuota,
                            fecha: actualDate,
                            valor: montoUltimaCuota,
                            tipo: tipo,
                            descripcion: `Cuota ${cuota}/${nroCuotas}`,
                            estado: 'Pagado',
                            importePago: montoUltimaCuota,
                            importePendiente: 0
                        }
                        payments.push(payment);
                    }
                } else {
                    let payment = {
                        idFinanciamiento,
                        nroCuota: cuota,
                        fecha: actualDate,
                        valor: montoUltimaCuota,
                        tipo: tipo,
                        descripcion: `Cuota ${cuota}/${nroCuotas}`,
                        estado: 'Pendiente',
                        importePago: 0,
                        importePendiente: montoUltimaCuota
                    }
                    payments.push(payment);
                }
            } else {
                if (cuota <= cuotasPagas) {
                    if (nroCuotaIncompleta === i + 1) {
                        let payment = {
                            idFinanciamiento,
                            nroCuota: cuota,
                            fecha: actualDate,
                            valor: importeRestante,
                            tipo: tipo,
                            descripcion: `Cuota ${cuota}/${nroCuotas}`,
                            estado: 'Pagado',
                            importePago: importePagado,
                            importePendiente: importeRestante
                        }
                        payments.push(payment);
                    }
                    else {
                        let payment = {
                            idFinanciamiento,
                            nroCuota: cuota,
                            fecha: actualDate,
                            valor: importeCuota,
                            tipo: tipo,
                            descripcion: `Cuota ${cuota}/${nroCuotas}`,
                            estado: 'Pagado',
                            importePago: importeCuota,
                            importePendiente: 0
                        }
                        payments.push(payment);
                    }
                } else {
                    let payment = {
                        idFinanciamiento,
                        nroCuota: cuota,
                        fecha: actualDate,
                        valor: importeCuota,
                        tipo: tipo,
                        descripcion: `Cuota ${cuota}/${nroCuotas}`,
                        estado: 'Pendiente',
                        importePago: 0,
                        importePendiente: importeCuota
                    }
                    payments.push(payment);
                }
            }
        }
    } else {
        //Tipo contado
        let payment = {
            idFinanciamiento,
            nroCuota: 1,
            fecha: fechaPrimerCuota,
            valor: importeCuota,
            tipo: 'Contado',
            descripcion: 'Cuota 1/1',
            estado: 'Pendiente',
            importePago: 0,
            importePendiente: importeCuota
        }
        payments.push(payment);
    }
    return { payments, actualDate };
}



const createMassivePayment = async (req, res, next) => {
    try {
        const { idFinanciamiento, nroCuotas, importeCuota, enganche, fechaPrimerCuota, periodo, montoUltimaCuota, adelanto, fechaInicio, tipo } = req.body;
        const importeAbonado = req?.body?.importeAbonado || 0;
        const { payments, actualDate } = getPaymentsForMassivePayment({ idFinanciamiento, nroCuotas, importeCuota, enganche, fechaPrimerCuota, periodo, montoUltimaCuota, adelanto, fechaInicio, tipo, importeAbonado });
        await paymentsService.createMassivePayments(payments);
        res.status(200).send({ message: 'Pagos realizados correctamente', success: true, lastDate: actualDate });
    } catch (error) {
        next(error);
    }
}

const updateCashPayment = async (req, res, next) => {
    const { idFinanciamiento, fecha } = req.body;
    try {
        const payments = await paymentsService.updateCashPayments({ idFinanciamiento, fecha });
        res.status(200).send({ message: 'Pagos actualizados correctamente', success: true, payments });
    } catch (error) {
        next(error);
    }
}

const paymentsController = {
    getPayments,
    getPayment,
    updatePayment,
    createPayment,
    deletePayment,
    getPaymentsOfFinancing,
    createPaymentUtil,
    getLastPendingPayment,
    deletePaymentsOfFinancing,
    createMassivePayment,
    getPaymentsForMassivePayment,
    updateCashPayment
}

module.exports = paymentsController;
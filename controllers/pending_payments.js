const pendingPaymentsService = require('../services/pending_payments')

const getPendingPayments = async (req, res, next) => {
    try {
        const pendingPayments = await pendingPaymentsService.getPendingPayments()
        res.status(200).json(pendingPayments)
    } catch (error) {
        next(error);
    }
}

const createPendingPayment = async (req, res, next) => {
    const { idCuota, monto, fecha, observacion, origen, estado, idEmpleado } = req.body;
    const pendingPayment = { idCuota, monto, fecha: new Date(fecha), observacion, origen, estado, idEmpleado: idEmpleado || 0 };
    try {
        const newPendingPayment = await pendingPaymentsService.createPendingPayment(pendingPayment)
        res.status(200).json(newPendingPayment)
    } catch (error) {
        next(error);
    }
}

const updatePendingPaymentStatus = async (req, res, next) => {
    const { id, estado } = req.body;
    try {
        const updatedPendingPayment = await pendingPaymentsService.updatePendingPaymentStatus(id, estado)
        res.status(200).json(updatedPendingPayment)
    } catch (error) {
        next(error);
    }
}

const cleanPendingPayments = async (req, res, next) => {
    const { idEmpleado } = req.body;
    try {
        const cleanedPendingPayments = await pendingPaymentsService.cleanPendingPayments(idEmpleado)
        res.status(200).json(cleanedPendingPayments)
    } catch (error) {
        next(error);
    }
}

const getPendingPaymentDetail = async (req, res, next) => {
    const { id } = req.body;
    try {
        const pendingPayment = await pendingPaymentsService.getPendingPaymentDetail(id)
        res.status(200).json(pendingPayment)
    } catch (error) {
        next(error);
    }
}


const deletePendingPayment = async (req, res, next) => {
    const { id } = req.body;
    try {
        const deletedPendingPayment = await pendingPaymentsService.deletePendingPayment(id)
        res.status(200).json(deletedPendingPayment)
    } catch (error) {
        next(error);
    }
}

const pendingPaymentsController = {
    getPendingPayments,
    createPendingPayment,
    updatePendingPaymentStatus,
    cleanPendingPayments,
    getPendingPaymentDetail,
    deletePendingPayment
}

module.exports = pendingPaymentsController;
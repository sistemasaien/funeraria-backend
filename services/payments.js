const { PrismaClient } = require('@prisma/client');
const errors = require('../helpers/errors');
const prisma = new PrismaClient();

const getPayments = async () => {
    try {
        const payments = await prisma.cobranzas.findMany();
        return payments;
    } catch (error) {
        errors.conflictError('Error al obtener los pagos', 'GET_PAYMENTS_DB', error);
    }
};

const getPayment = async (id) => {
    try {
        const payment = await prisma.cobranzas.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return payment;
    } catch (error) {
        errors.conflictError('Error al obtener el pago', 'GET_PAYMENT_DB', error);
    }
};

const createPayment = async (payment) => {
    try {
        const newPayment = await prisma.cobranzas.create({
            data: payment
        });
        return newPayment;
    } catch (error) {
        errors.conflictError('Error al crear el pago', 'CREATE_PAYMENT_DB', error);
    }
};

const updatePayment = async (id, payment) => {
    try {
        const updatedPayment = await prisma.cobranzas.update({
            where: {
                id: parseInt(id)
            },
            data: payment
        });
        return updatedPayment;
    } catch (error) {
        errors.conflictError('Error al actualizar el pago', 'UPDATE_PAYMENT_DB', error);
    }
};

const deletePayment = async (id) => {
    try {
        const deletedPayment = await prisma.cobranzas.delete({
            where: {
                id: parseInt(id)
            }
        });
        return deletedPayment;
    } catch (error) {
        errors.conflictError('Error al eliminar el pago', 'DELETE_PAYMENT_DB', error);
    }
};

const getLastPendingPayment = async (id) => {
    try {
        const payment = await prisma.$queryRaw`SELECT * FROM cobranzas WHERE idFinanciamiento = ${id} AND estado = 'Pendiente'
        AND id NOT IN(SELECT idCuota FROM pagos_pendientes WHERE estado = 'PENDIENTE' OR estado = 'Pendiente')
        ORDER BY nroCuota ASC LIMIT 1`;
        return payment[0];
    } catch (error) {
        errors.conflictError('Error al obtener el último pago pendiente', 'GET_LAST_PENDING_PAYMENT_DB', error);
    }
}

const getPaymentsOfFinancing = async (idFinanciamiento) => {
    try {
        const payments = await prisma.cobranzas.findMany({
            where: {
                idFinanciamiento: parseInt(idFinanciamiento)
            }
        });
        return payments;
    } catch (error) {
        errors.conflictError('Error al obtener los pagos del financiamiento', 'GET_PAYMENTS_OF_FINANCING_DB', error);
    }
}

const deletePaymentsOfFinancing = async (idFinanciamiento) => {
    try {
        const deletedPayments = await prisma.cobranzas.deleteMany({
            where: {
                idFinanciamiento: parseInt(idFinanciamiento)
            }
        });
        return deletedPayments;
    } catch (error) {
        errors.conflictError('Error al eliminar los pagos del financiamiento', 'DELETE_PAYMENTS_OF_FINANCING_DB', error);
    }
}

const createMassivePayments = async (payments) => {
    try {
        const newPayments = await prisma.cobranzas.createMany({
            data: payments
        });
        return newPayments;
    }
    catch (error) {
        errors.conflictError('Error al crear el pago masivo', 'CREATE_MASSIVE_PAYMENTS_DB', error);
    }
}

const updateCashPayments = async ({ fecha, idFinanciamiento }) => {
    try {
        const updatedPayments = await prisma.$queryRaw`UPDATE cobranzas SET fecha = '${fecha}' WHERE idFinanciamiento = ${idFinanciamiento} AND tipo = 'Contado'`;
        return updatedPayments;
    } catch (error) {
        errors.conflictError('Error al actualizar los pagos a efectivo', 'UPDATE_PAYMENTS_TO_CASH_DB', error);
    }
}


const paymentsService = {
    getPayments,
    getPayment,
    createPayment,
    updatePayment,
    deletePayment,
    getLastPendingPayment,
    getPaymentsOfFinancing,
    deletePaymentsOfFinancing,
    createMassivePayments,
    updateCashPayments
};

module.exports = paymentsService;
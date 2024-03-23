const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getPendingPayments = async () => {
    try {
        const pendingPayments = await prisma.$queryRaw`
        SELECT pp.*, f.idContrato, f.idCliente, c.nombre, c.domicilioCobranza, e.nombre as nombreEmpleado 
        FROM pagos_pendientes pp, financiamientos f, cobranzas cc, clientes c, empleados e
        WHERE pp.idCuota = cc.id
        AND cc.idFinanciamiento = f.id
        AND f.idCliente = c.id
        AND pp.idEmpleado = e.id
        AND pp.estado <> 'PROCESADO'`
        return pendingPayments;
    } catch (error) {
        errors.conflictError('Error al obtener los pagos pendientes', 'GET_PENDING_PAYMENTS_DB', error);
    }
}

const createPendingPayment = async (pendingPayment) => {
    try {
        const newPendingPayment = await prisma.pagos_pendientes.create({
            data: pendingPayment
        });
        return newPendingPayment;
    } catch (error) {
        errors.conflictError('Error al crear el pago pendiente', 'CREATE_PENDING_PAYMENT_DB', error);
    }
}

const updatePendingPaymentStatus = async (id, estado) => {
    try {
        const updatedPendingPayment = await prisma.pagos_pendientes.update({
            where: {
                id: parseInt(id)
            },
            data: {
                estado: estado
            }
        });
        return updatedPendingPayment;
    } catch (error) {
        errors.conflictError('Error al actualizar el pago pendiente', 'UPDATE_PENDING_PAYMENT_DB', error);
    }
}

const cleanPendingPayments = async (idEmpleado) => {
    try {
        const updatedPendingPayments = await prisma.pagos_pendientes.updateMany({
            where: {
                idEmpleado: parseInt(idEmpleado)
            },
            data: {
                estado: 'PROCESADO'
            }
        });
        return updatedPendingPayments;
    } catch (error) {
        errors.conflictError('Error al limpiar los pagos pendientes', 'CLEAN_PENDING_PAYMENTS_DB', error);
    }
}

const deletePendingPayment = async (id) => {
    try {
        const deletedPendingPayment = await prisma.pagos_pendientes.delete({
            where: {
                id: parseInt(id)
            }
        });
        return deletedPendingPayment;
    } catch (error) {
        errors.conflictError('Error al eliminar el pago pendiente', 'DELETE_PENDING_PAYMENT_DB', error);
    }
}

const getPendingPaymentDetail = async (id) => {
    try {
        const pendingPayment = await prisma.$queryRaw`
        SELECT pp.*, c.valor, cl.nombre, f.importePendiente, f.atraso, f.importeAbonado, f.idContrato, f.importePendiente, (f.importePendiente - pp.monto) as nuevoImportePendiente 
        FROM pagos_pendientes pp, financiamientos f, clientes cl, cobranzas c
        WHERE pp.idCuota = c.id
        AND c.idFinanciamiento = f.id 
        AND f.idCliente = cl.id
        AND pp.id = ${id}`
        return pendingPayment;
    }
    catch (error) {
        errors.conflictError('Error al obtener el detalle del pago pendiente', 'GET_PENDING_PAYMENT_DETAIL_DB', error);
    }
}

const pendingPaymentsService = {
    getPendingPayments,
    createPendingPayment,
    updatePendingPaymentStatus,
    cleanPendingPayments,
    deletePendingPayment,
    getPendingPaymentDetail
}

module.exports = pendingPaymentsService
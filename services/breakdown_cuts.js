const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const createBreakdownCut = async (breakdowns) => {
    try {
        const newBreakdownCut = await prisma.cortes_desglose.createMany({
            data: breakdowns
        })
        return newBreakdownCut
    } catch (error) {
        errors.conflictError('Error al crear el desglose de corte', 'CREATE_BREAKDOWN_CUT_DB', error)
    }
}

const updateBreakdownCutPayments = async (idCorte, estado) => {
    try {
        const response = await prisma.cortes_desglose.updateMany({
            where: {
                idCorte: parseInt(idCorte)
            },
            data: {
                estado: estado
            }
        })
        return response
    } catch (error) {
        errors.conflictError('Error al actualizar el estado del desglose de corte', 'UPDATE_BREAKDOWN_CUT_PAYMENTS_DB', error)
    }
}

const deleteBreakdownCut = async (id) => {
    try {
        await prisma.$queryRaw`UPDATE cortes c SET c.cantidadCobros = c.cantidadCobros - 1, c.monto = c.monto - (SELECT cg.monto FROM cortes_desglose cg WHERE cg.id = ${id}) WHERE c.id = (SELECT cg2.idCorte FROM cortes_desglose cg2 WHERE cg2.id = ${id});`
        const response = await prisma.cortes_desglose.delete({
            where: {
                id: parseInt(id)
            }
        })
        return response
    } catch (error) {
        errors.conflictError('Error al eliminar el desglose de corte', 'DELETE_BREAKDOWN_CUT_DB', error)
    }
}

const updateBreakdownCut = async (id, breakdown) => {
    try {
        const updatedBreakdownCut = await prisma.cortes_desglose.update({
            where: {
                id: parseInt(id)
            },
            data: breakdown
        })
        return updatedBreakdownCut
    } catch (error) {
        errors.conflictError('Error al actualizar el desglose de corte', 'UPDATE_BREAKDOWN_CUT_DB', error)
    }
}

const getBreakdownCuts = async (id) => {
    try {
        const breakdownCuts = await prisma.$queryRaw`SELECT cg.*, c.valor, cl.nombre, f.importePendiente, f.periodo, c.nroCuota, f.numeroPagos, f.medioPago, f.montoFinanciado, f.atraso, f.importeAbonado, f.idContrato, f.importePendiente, (f.importePendiente - cg.monto) as nuevoImportePendiente FROM cortes_desglose cg, financiamientos f, clientes cl, cobranzas c
        WHERE cg.idCuota = c.id
        AND c.idFinanciamiento = f.id 
        AND f.idCliente = cl.id
        AND idCorte = ${id}`
        return breakdownCuts
    } catch (error) {
        errors.conflictError('Error al obtener el desglose de corte', 'GET_BREAKDOWN_CUTS_DB', error)
    }
}

const breakdownCutsService = {
    createBreakdownCut,
    updateBreakdownCutPayments,
    deleteBreakdownCut,
    updateBreakdownCut,
    getBreakdownCuts
}

module.exports = breakdownCutsService
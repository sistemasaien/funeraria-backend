const financingsService = require('../services/financings')
const errors = require('../helpers/errors')
const paymentsService = require('../services/payments')
const contractsService = require('../services/contracts')

const getFinancings = async (req, res, next) => {
    try {
        const financings = await financingsService.getFinancings()
        res.status(200).json(financings)
    } catch (error) {
        next(error);
    }
}

const getCompleteFinancings = async (req, res, next) => {
    try {
        const financings = await financingsService.getCompleteFinancings()
        res.status(200).json(financings)
    } catch (error) {
        next(error);
    }
}

const getFinancing = async (req, res, next) => {
    const { id } = req.params;
    try {
        const financing = await financingsService.getFinancing(id)
        if (!financing) {
            errors.notFoundError('Financiamiento no encontrado', 'FINANCING_NOT_FOUND')
        }
        res.status(200).json(financing)
    } catch (error) {
        next(error);
    }
}

const createFinancing = async (req, res, next) => {
    try {
        const { idCliente, medioPago, precioBase, bonificacion, enganche, montoFinanciado, numeroPagos, interesMora, periodo, importeCuota, importeTotal, importePendiente, importeAbonado, fechaPrimerCuota, fechaUltimaCuota } = req.body;
        const atraso = req.body?.atraso;
        const adelanto = req.body?.adelanto;
        const activo = req.body?.activo === 'NO' ? 'NO' : 'SI';

        const financing = { idCliente, medioPago, precioBase, bonificacion, enganche, montoFinanciado, numeroPagos, interesMora, periodo, importeCuota, importeTotal, importePendiente, importeAbonado, atraso, adelanto, fechaPrimerCuota, fechaUltimaCuota, activo };
        const newFinancing = await financingsService.createFinancing(financing)
        res.status(200).json(newFinancing)
    } catch (error) {
        next(error);
    }
}

const updateFinancing = async (req, res, next) => {
    try {
        const { id, idCliente, medioPago, precioBase, bonificacion, enganche, montoFinanciado, numeroPagos, interesMora, periodo, importeCuota, importeTotal, importePendiente, importeAbonado, fechaPrimerCuota, fechaUltimaCuota } = req.body;
        const atraso = req.body?.atraso;
        const adelanto = req.body?.adelanto;
        const activo = req.body?.activo === 'NO' ? 'NO' : 'SI';

        const financing = { id, idCliente, medioPago, precioBase, bonificacion, enganche, montoFinanciado, numeroPagos, interesMora, periodo, importeCuota, importeTotal, importePendiente, importeAbonado, atraso, adelanto, fechaPrimerCuota, fechaUltimaCuota, activo };
        const updatedFinancing = await financingsService.updateFinancing(id, financing)
        res.status(200).json(updatedFinancing)
    } catch (error) {
        next(error);
    }
}

const deleteFinancing = async (req, res, next) => {
    try {
        const { id } = req.body;
        const financingToDelete = await financingsService.getFinancing(id)
        if (!financingToDelete) {
            errors.notFoundError('Financiamiento no encontrado', 'FINANCING_NOT_FOUND')
        }
        const deletedFinancing = await financingsService.deleteFinancing(id)
        res.status(200).json(deletedFinancing)
    } catch (error) {
        next(error);
    }
}

const resetFinancingUtil = async (id) => {
    try {
        const financing = await financingsService.getFinancing(id)
        if (!financing) {
            errors.notFoundError('Financiamiento no encontrado', 'FINANCING_NOT_FOUND')
        }
        await paymentsService.deletePaymentsOfFinancing(id)
        let newFinancing = {
            ...financing,
            montoFinanciado: 0,
            importeAbonado: 0,
            importeTotal: 0,
            bonificacion: 0,
            enganche: 0,
            numeroPagos: 0,
            periodo: "",
            importeCuota: 0,
            importePendiente: 0,
            atraso: 0,
            adelanto: 0,
            precioBase: 0
        }
        let updatedFinancing = await financingsService.updateFinancing(id, newFinancing)
        let contract = await contractsService.getContract(parseInt(financing.idContrato))
        contract.idPaquete = 0
        await contractsService.updateContract(contract.id, contract)
        return updatedFinancing
    } catch (error) {
        throw error
    }
}

const resetFinancing = async (req, res, next) => {
    try {
        const { id } = req.body;
        let updatedFinancing = await resetFinancingUtil(id)
        res.status(200).json(updatedFinancing)
    } catch (error) {
        next(error);
    }
}

const getFinancingByContract = async (req, res, next) => {
    try {
        const { id } = req.params;
        const financing = await financingsService.getFinancingByContract(id)
        return financing
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getFinancings,
    getCompleteFinancings,
    getFinancing,
    createFinancing,
    updateFinancing,
    deleteFinancing,
    resetFinancingUtil,
    resetFinancing,
    getFinancingByContract
}
const breakdownCutsService = require('../services/breakdown_cuts')
const dayjs = require('dayjs');

const createBreakdownCut = async (req, res, next) => {
    try {
        const { breakdowns } = req.body;
        let newBreakdowns = breakdowns?.map(breakdown => {
            return {
                ...breakdown,
                fecha: dayjs(breakdown.fecha).format()
            }
        });

        const newBreakdownCut = await breakdownCutsService.createBreakdownCut(newBreakdowns);
        res.status(200).send({ message: 'Detalle de corte creado correctamente', success: true });
    } catch (error) {
        next(error);
    }
}

const updateBreakdownCutPayments = async (req, res, next) => {
    try {
        const { idCorte, estado } = req.body;
        const updatedBreakdownCut = await breakdownCutsService.updateBreakdownCutPayments(idCorte, estado);
        res.status(200).send({ message: 'Detalle de corte actualizado correctamente', success: true });
    } catch (error) {
        next(error);
    }
}

const deleteBreakdownCut = async (req, res, next) => {
    try {
        const { id } = req.body;
        const deletedBreakdownCut = await breakdownCutsService.deleteBreakdownCut(id);
        res.status(200).send({ message: 'Detalle de corte eliminado correctamente', success: true });
    } catch (error) {
        next(error);
    }
}

const updateBreakdownCut = async (req, res, next) => {
    try {
        const { id, breakdown } = req.body;
        const updatedBreakdownCut = await breakdownCutsService.updateBreakdownCut(id, breakdown);
        res.status(200).send({ message: 'Detalle de corte actualizado correctamente', success: true });
    } catch (error) {
        next(error);
    }
}

const getBreakdownCuts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const breakdownCuts = await breakdownCutsService.getBreakdownCuts(id);
        res.status(200).send(breakdownCuts);
    } catch (error) {
        next(error);
    }
}

const breakdownCutsController = {
    createBreakdownCut,
    updateBreakdownCutPayments,
    deleteBreakdownCut,
    updateBreakdownCut,
    getBreakdownCuts
}

module.exports = breakdownCutsController;
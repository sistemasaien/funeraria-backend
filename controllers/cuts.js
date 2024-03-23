const cutsService = require('../services/cuts');
const dayjs = require('dayjs');

const getCuts = async (req, res, next) => {
    try {
        const cuts = await cutsService.getCuts();
        res.status(200).send(cuts);
    } catch (error) {
        next(error);
    }
}

const createCut = async (req, res, next) => {
    const { idEmpleado, monto, cantidadCobros, idsCobros, origen } = req.body;
    //datetime on ISO 8601 format
    const datetime = dayjs().format();
    const estado = 'Pendiente';
    const textIdsCobros = idsCobros.join(',');

    const cut = {
        idEmpleado,
        monto,
        cantidadCobros,
        fecha: datetime,
        estado,
        idsCobros: textIdsCobros,
        origen
    }

    try {
        const newCut = await cutsService.createCut(cut);
        res.status(200).send({ message: 'Corte creado correctamente', success: true, insertedId: newCut.id });
    } catch (error) {
        next(error);
    }
}

const getCut = async (req, res, next) => {
    const { id } = req.params;
    try {
        const cut = await cutsService.getCut(id);
        res.status(200).send(cut);
    } catch (error) {
        next(error);
    }
}

const updateCutStatus = async (req, res, next) => {
    const { id, estado } = req.body;
    try {
        const updatedCut = await cutsService.updateCut(id, { estado });
        res.status(200).send({ message: 'Corte actualizado correctamente', success: true });
    } catch (error) {
        next(error);
    }
}

const cutsController = {
    getCuts,
    createCut,
    getCut,
    updateCutStatus
}

module.exports = cutsController;

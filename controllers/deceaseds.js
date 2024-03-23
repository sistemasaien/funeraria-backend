const deceasedsService = require('../services/deceaseds')
const errors = require('../helpers/errors')

const getDeceaseds = async (req, res, next) => {
    try {
        const deceaseds = await deceasedsService.getDeceaseds()
        res.status(200).json(deceaseds)
    } catch (error) {
        next(error);
    }
}

const getDeceased = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deceased = await deceasedsService.getDeceased(id)
        if (!deceased) {
            errors.notFoundError('Fallecido no encontrado', 'DECEASED_NOT_FOUND')
        }
        res.status(200).json(deceased)
    } catch (error) {
        next(error);
    }
}

const updateDeceased = async (req, res, next) => {
    const { id, nombre, lugarVelacion, causas, fechaNacimiento, fechaDefuncion, edad, estadoCivil, lugarDefuncion, lugarRecoleccion } = req.body;
    const deceased = { id, nombre, lugarVelacion, causas, fechaNacimiento, fechaDefuncion, edad, estadoCivil, lugarDefuncion, lugarRecoleccion };
    try {

        const deceasedToUpdate = await deceasedsService.getDeceased(id)
        if (!deceasedToUpdate) {
            errors.notFoundError('Fallecido no encontrado', 'DECEASED_NOT_FOUND')
        }

        const updatedDeceased = await deceasedsService.updateDeceased(id, deceased)
        res.status(200).json(updatedDeceased)
    } catch (error) {
        next(error);
    }
}

const createDeceased = async (req, res, next) => {
    const { nombre, lugarVelacion, causas, fechaNacimiento, fechaDefuncion, edad, estadoCivil, lugarDefuncion, lugarRecoleccion } = req.body;
    const deceased = { nombre, lugarVelacion, causas, fechaNacimiento, fechaDefuncion, edad, estadoCivil, lugarDefuncion, lugarRecoleccion };
    try {
        const newDeceased = await deceasedsService.createDeceased(deceased)
        res.status(200).json(newDeceased)
    } catch (error) {
        next(error);
    }
}

const deleteDeceased = async (req, res, next) => {
    const { id } = req.body;
    try {
        const deceasedToDelete = await deceasedsService.getDeceased(id)
        if (!deceasedToDelete) {
            errors.notFoundError('Fallecido no encontrado', 'DECEASED_NOT_FOUND')
        }

        const deletedDeceased = await deceasedsService.deleteDeceased(id)
        res.status(200).json(deletedDeceased)
    } catch (error) {
        next(error);
    }
}

const deceasedsController = {
    getDeceaseds,
    getDeceased,
    updateDeceased,
    createDeceased,
    deleteDeceased
}

module.exports = deceasedsController;
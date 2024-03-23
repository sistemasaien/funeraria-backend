const obituariesService = require('../services/obituaries')
const errors = require('../helpers/errors')

const getObituaries = async (req, res, next) => {
    try {
        const obituaries = await obituariesService.getObituaries()
        res.status(200).json(obituaries)
    } catch (error) {
        next(error);
    }
}

const getObituary = async (req, res, next) => {
    const { id } = req.params;
    try {
        const obituary = await obituariesService.getObituary(id)
        if (!obituary) {
            errors.notFoundError('Esquela no encontrada', 'OBITUARY_NOT_FOUND')
        }
        res.status(200).json(obituary)
    } catch (error) {
        next(error);
    }
}

const updateObituary = async (req, res, next) => {
    const { id, nombre, descripcion, url_view, url_share } = req.body;
    const obituary = { id, nombre, descripcion, url_view, url_share };
    try {

        const obituaryToUpdate = await obituariesService.getObituary(id)
        if (!obituaryToUpdate) {
            errors.notFoundError('Esquela no encontrada', 'OBITUARY_NOT_FOUND')
        }

        const updatedObituary = await obituariesService.updateObituary(id, obituary)
        res.status(200).json(updatedObituary)
    } catch (error) {
        next(error);
    }
}

const createObituary = async (req, res, next) => {
    const { nombre, descripcion, url_view, url_share } = req.body;
    const obituary = { nombre, descripcion, url_view, url_share };
    try {
        const newObituary = await obituariesService.createObituary(obituary)
        res.status(200).json(newObituary)
    } catch (error) {
        next(error);
    }
}

const deleteObituary = async (req, res, next) => {
    const { id } = req.body;
    try {
        const obituaryToDelete = await obituariesService.getObituary(id)
        if (!obituaryToDelete) {
            errors.notFoundError('Esquela no encontrada', 'OBITUARY_NOT_FOUND')
        }

        const deletedObituary = await obituariesService.deleteObituary(id)
        res.status(200).json(deletedObituary)
    } catch (error) {
        next(error);
    }
}

const obituariesController = {
    getObituaries,
    getObituary,
    updateObituary,
    createObituary,
    deleteObituary
}

module.exports = obituariesController;
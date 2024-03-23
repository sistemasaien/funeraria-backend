const packsService = require('../services/packs')
const errors = require('../helpers/errors')
const packSchema = require('../schemas/pack')
const validateSchema = require('../helpers/validate')

const getPacks = async (req, res, next) => {
    try {
        const packs = await packsService.getPacks()
        res.status(200).json(packs)
    } catch (error) {
        next(error);
    }
}

const getPack = async (req, res, next) => {
    const { id } = req.params;
    try {
        const pack = await packsService.getPack(id)
        if (!pack) {
            errors.notFoundError('Paquete no encontrado', 'PACK_NOT_FOUND')
        }
        res.status(200).json(pack)
    } catch (error) {
        next(error);
    }
}

const updatePack = async (req, res, next) => {
    try {
        await validateSchema(packSchema, req.body)
        const { id, nombrePaquete, precioPaquete, ataudModelo, capilla } = req.body;
        const pack = { id, nombrePaquete, precioPaquete, ataudModelo, capilla };
        const packToUpdate = await packsService.getPack(id)
        if (!packToUpdate) {
            errors.notFoundError('Paquete no encontrado', 'PACK_NOT_FOUND')
        }

        const updatedPack = await packsService.updatePack(id, pack)
        res.status(200).json(updatedPack)
    } catch (error) {
        next(error);
    }
}

const createPack = async (req, res, next) => {
    try {
        await validateSchema(packSchema, req.body)
        const { nombrePaquete, precioPaquete, ataudModelo, capilla } = req.body;
        const pack = { nombrePaquete, precioPaquete, ataudModelo, capilla };
        const newPack = await packsService.createPack(pack)
        res.status(200).json(newPack)
    } catch (error) {
        next(error);
    }
}

const deletePack = async (req, res, next) => {
    const { id } = req.body;
    try {
        const packToDelete = await packsService.getPack(id)
        if (!packToDelete) {
            errors.notFoundError('Paquete no encontrado', 'PACK_NOT_FOUND')
        }

        const deletedPack = await packsService.deletePack(id)
        res.status(200).json(deletedPack)
    } catch (error) {
        next(error);
    }
}

const packsController = {
    getPacks,
    getPack,
    updatePack,
    createPack,
    deletePack
}

module.exports = packsController;
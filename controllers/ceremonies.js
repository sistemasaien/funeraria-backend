const ceremoniesService = require('../services/ceremonies');
const errors = require('../helpers/errors');

const getCeremonies = async (req, res, next) => {
    try {
        const ceremonies = await ceremoniesService.getCeremonies();
        res.status(200).json(ceremonies);
    } catch (error) {
        next(error);
    }
};

const getCeremony = async (req, res, next) => {
    const { id } = req.params;
    try {
        const ceremony = await ceremoniesService.getCeremony(id);
        if (!ceremony) {
            errors.notFoundError('Ceremonia no encontrada', 'CEREMONY_NOT_FOUND');
        }
        res.status(200).json(ceremony);
    } catch (error) {
        next(error);
    }
};

const updateCeremony = async (req, res, next) => {
    const { id, idFallecido, familia, diaMisa, horaMisa, templo, panteon, novenarios, spotsRadio, esquelasImpresas, publicacionPagina, fotografia, spotsRedesSociales } = req.body;
    const ceremony = { idFallecido, familia, diaMisa, horaMisa, templo, panteon, novenarios, spotsRadio, esquelasImpresas, publicacionPagina, fotografia, spotsRedesSociales };
    try {
        const ceremonyToUpdate = await ceremoniesService.getCeremony(id);
        if (!ceremonyToUpdate) {
            errors.notFoundError('Ceremonia no encontrada', 'CEREMONY_NOT_FOUND');
        }

        const updatedCeremony = await ceremoniesService.updateCeremony(id, ceremony);
        res.status(200).json(updatedCeremony);
    } catch (error) {
        next(error);
    }
};

const createCeremony = async (req, res, next) => {
    const { idFallecido, familia, diaMisa, horaMisa, templo, panteon, novenarios, spotsRadio, esquelasImpresas, publicacionPagina, fotografia, spotsRedesSociales } = req.body;
    const ceremony = { idFallecido, familia, diaMisa, horaMisa, templo, panteon, novenarios, spotsRadio, esquelasImpresas, publicacionPagina, fotografia, spotsRedesSociales };
    try {
        const newCeremony = await ceremoniesService.createCeremony(ceremony);
        res.status(200).json(newCeremony);
    } catch (error) {
        next(error);
    }
};

const deleteCeremony = async (req, res, next) => {
    const { id } = req.body;
    try {
        const ceremonyToDelete = await ceremoniesService.getCeremony(id);
        if (!ceremonyToDelete) {
            errors.notFoundError('Ceremonia no encontrada', 'CEREMONY_NOT_FOUND');
        }

        const deletedCeremony = await ceremoniesService.deleteCeremony(id);
        res.status(200).json(deletedCeremony);
    } catch (error) {
        next(error);
    }
};

const ceremoniesController = {
    getCeremonies,
    getCeremony,
    updateCeremony,
    createCeremony,
    deleteCeremony
};

module.exports = ceremoniesController;
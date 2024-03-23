const profilesService = require('../services/profiles');
const errors = require('../helpers/errors');

const getProfiles = async (req, res, next) => {
    try {
        const profiles = await profilesService.getProfiles();
        res.status(200).json(profiles);
    } catch (error) {
        next(error);
    }
}

const getProfile = async (req, res, next) => {
    const { id } = req.params;
    try {
        const profile = await profilesService.getProfile(id);
        if (!profile) {
            errors.notFoundError('Perfil no encontrado', 'PROFILE_NOT_FOUND');
        }
        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
}

const createProfile = async (req, res, next) => {
    const { nombre } = req.body;
    const profile = { nombre };
    try {
        let profileExists = await profilesService.getProfileByName(nombre);
        if (profileExists) {
            errors.conflictError('El perfil ya existe', 'PROFILE_ALREADY_EXISTS');
        }
        const newProfile = await profilesService.createProfile(profile);
        res.status(200).json(newProfile);
    } catch (error) {
        next(error);
    }
}

const updateProfile = async (req, res, next) => {
    const { id, nombre } = req.body;
    const profile = { id, nombre };
    try {
        const profileToUpdate = await profilesService.getProfile(id);
        if (!profileToUpdate) {
            errors.notFoundError('Perfil no encontrado', 'PROFILE_NOT_FOUND');
        }
        const updatedProfile = await profilesService.updateProfile(profile);
        res.status(200).json(updatedProfile);
    } catch (error) {
        next(error);
    }
}

const deleteProfile = async (req, res, next) => {
    const { id } = req.body;
    try {
        const profileToDelete = await profilesService.getProfile(id);
        if (!profileToDelete) {
            errors.notFoundError('Perfil no encontrado', 'PROFILE_NOT_FOUND');
        }
        const deletedProfile = await profilesService.deleteProfile(id);
        res.status(200).json(deletedProfile);
    } catch (error) {
        next(error);
    }
}

const profilesController = {
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile
};

module.exports = profilesController;

const { PrismaClient } = require('@prisma/client');
const errors = require('../helpers/errors');
const prisma = new PrismaClient();

const getProfiles = async () => {
    try {
        const profiles = await prisma.perfiles.findMany();
        return profiles;
    } catch (error) {
        errors.conflictError('Error al obtener los perfiles', 'GET_PROFILES_DB', error);
    }
};

const getProfile = async (id) => {
    try {
        const profile = await prisma.perfiles.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return profile;
    } catch (error) {
        errors.conflictError('Error al obtener el perfil', 'GET_PROFILE_DB', error);
    }
};

const createProfile = async (profile) => {
    try {
        const newProfile = await prisma.perfiles.create({
            data: profile
        });
        return newProfile;
    } catch (error) {
        errors.conflictError('Error al crear el perfil', 'CREATE_PROFILE_DB', error);
    }
};

const updateProfile = async (profile) => {
    try {
        const updatedProfile = await prisma.perfiles.update({
            where: {
                id: parseInt(profile.id)
            },
            data: {
                nombre: profile.nombre
            }
        });
        return updatedProfile;
    } catch (error) {
        errors.conflictError('Error al actualizar el perfil', 'UPDATE_PROFILE_DB', error);
    }
};

const deleteProfile = async (id) => {
    try {
        const deletedProfile = await prisma.perfiles.delete({
            where: {
                id: parseInt(id)
            }
        });
        return deletedProfile;
    } catch (error) {
        errors.conflictError('Error al eliminar el perfil', 'DELETE_PROFILE_DB', error);
    }
};

const getProfileByName = async (name) => {
    try {
        const profile = await prisma.perfiles.findUnique({
            where: {
                nombre: name
            }
        });
        return profile;
    } catch (error) {
        errors.conflictError('Error al obtener el perfil', 'GET_PROFILE_DB', error);
    }
};

const profilesService = {
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfileByName
};

module.exports = profilesService;

const { PrismaClient } = require('@prisma/client');
const errors = require('../helpers/errors');
const prisma = new PrismaClient();

const getCeremonies = async () => {
    try {
        const ceremonies = await prisma.ceremonias.findMany();
        return ceremonies;
    } catch (error) {
        errors.conflictError('Error al obtener las ceremonias', 'GET_CEREMONIES_DB', error);
    }
};

const getCeremony = async (id) => {
    try {
        const ceremony = await prisma.ceremonias.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return ceremony;
    } catch (error) {
        errors.conflictError('Error al obtener la ceremonia', 'GET_CEREMONY_DB', error);
    }
};

const createCeremony = async (ceremony) => {
    try {
        const newCeremony = await prisma.ceremonias.create({
            data: ceremony
        });
        return newCeremony;
    } catch (error) {
        errors.conflictError('Error al crear la ceremonia', 'CREATE_CEREMONY_DB', error);
    }
};

const updateCeremony = async (id, ceremony) => {
    try {
        const updatedCeremony = await prisma.ceremonias.update({
            where: {
                id: parseInt(id)
            },
            data: ceremony
        });
        return updatedCeremony;
    } catch (error) {
        errors.conflictError('Error al actualizar la ceremonia', 'UPDATE_CEREMONY_DB', error);
    }
};

const deleteCeremony = async (id) => {
    try {
        const deletedCeremony = await prisma.ceremonias.delete({
            where: {
                id: parseInt(id)
            }
        });
        return deletedCeremony;
    } catch (error) {
        errors.conflictError('Error al eliminar la ceremonia', 'DELETE_CEREMONY_DB', error);
    }
};

const ceremoniesService = {
    getCeremonies,
    getCeremony,
    createCeremony,
    updateCeremony,
    deleteCeremony
};

module.exports = ceremoniesService;
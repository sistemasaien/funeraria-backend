const { PrismaClient } = require('@prisma/client');
const errors = require('../helpers/errors');
const prisma = new PrismaClient();

const getPayrollProfiles = async () => {
    try {
        const payrollProfiles = await prisma.nominas_perfiles.findMany();
        return payrollProfiles;
    } catch (error) {
        errors.conflictError('Error al obtener los perfiles de nómina', 'GET_PAYROLL_PROFILES_DB', error);
    }
};

const getPayrollProfile = async (id) => {
    try {
        const profile = await prisma.nominas_perfiles.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return profile;
    } catch (error) {
        errors.conflictError('Error al obtener el perfil de nómina', 'GET_PAYROLL_PROFILE_DB', error);
    }
};

const createPayrollProfile = async (profile) => {
    try {
        const newPayrollProfile = await prisma.nominas_perfiles.create({
            data: profile
        });
        return newPayrollProfile;
    } catch (error) {
        errors.conflictError('Error al crear el perfil de nómina', 'CREATE_PAYROLL_PROFILE_DB', error);
    }
};

const updatePayrollProfile = async (id, payrollProfile) => {
    try {
        const updatedPayrollProfile = await prisma.nominas_perfiles.update({
            where: {
                id: parseInt(id)
            },
            data: payrollProfile
        });
        return updatedPayrollProfile;
    } catch (error) {
        errors.conflictError('Error al actualizar el perfil de nómina', 'UPDATE_PAYROLL_PROFILE_DB', error);
    }
};

const deletePayrollProfile = async (id) => {
    try {
        const deletedPayrollProfile = await prisma.nominas_perfiles.delete({
            where: {
                id: parseInt(id)
            }
        });
        return deletedPayrollProfile;
    } catch (error) {
        errors.conflictError('Error al eliminar el perfil de nómina', 'DELETE_PAYROLL_PROFILE_DB', error);
    }
};

const addPayrollProfilePack = async (item) => {
    try {
        const addedPayrollProfilePack = await prisma.nominas_perfiles_paquetes.create({
            data: item
        });
        return addedPayrollProfilePack;
    } catch (error) {
        errors.conflictError('Error al agregar el paquete al perfil de nómina', 'ADD_PAYROLL_PROFILE_PACK_DB', error);
    }
}

const getPayrollByProfileAndPack = async (profileId, packId) => {
    try {
        const payroll = await prisma.nominas_perfiles_paquetes.findFirst({
            where: {
                idPerfil: parseInt(profileId),
                idPaquete: parseInt(packId)
            }
        });
        return payroll;
    } catch (error) {
        errors.conflictError('Error al obtener la nómina por perfil y paquete', 'GET_PAYROLL_BY_PROFILE_AND_PACK_DB', error);
    }
}

const getPayrollProfileAndPacks = async (id) => {
    try {
        const profileAndPacks = await prisma.$queryRaw`SELECT npp.*, p.nombrePaquete FROM nominas_perfiles_paquetes npp, paquetes p WHERE npp.idPaquete = p.id AND npp.idPerfil = ${id};`
        return profileAndPacks;
    } catch (error) {
        errors.conflictError('Error al obtener el perfil de nómina y sus paquetes', 'GET_PAYROLL_PROFILE_AND_PACKS_DB', error);
    }
}

const deletePackOfPayrollProfile = async (idPerfil, idPaquete) => {
    try {
        const deletedPackOfPayrollProfile = await prisma.nominas_perfiles_paquetes.delete({
            where: {
                idPerfil_idPaquete: {
                    idPerfil: parseInt(idPerfil),
                    idPaquete: parseInt(idPaquete)
                }
            }
        });
        return deletedPackOfPayrollProfile;
    } catch (error) {
        errors.conflictError('Error al eliminar el paquete del perfil de nómina', 'DELETE_PACK_OF_PAYROLL_PROFILE_DB', error);
    }
}

const updatePackOfPayrollProfile = async (data) => {
    try {
        const updatedPackOfPayrollProfile = await prisma.nominas_perfiles_paquetes.update({
            where: {
                idPerfil_idPaquete: {
                    idPerfil: data.idPerfil,
                    idPaquete: data.idPaquete
                }
            },
            data: data
        });
        return updatedPackOfPayrollProfile;
    } catch (error) {
        errors.conflictError('Error al actualizar el paquete del perfil de nómina', 'UPDATE_PACK_OF_PAYROLL_PROFILE_DB', error);
    }
}

const profilesService = {
    getPayrollProfiles,
    getPayrollProfile,
    createPayrollProfile,
    updatePayrollProfile,
    deletePayrollProfile,
    addPayrollProfilePack,
    getPayrollByProfileAndPack,
    getPayrollProfileAndPacks,
    deletePackOfPayrollProfile,
    updatePackOfPayrollProfile
};

module.exports = profilesService;

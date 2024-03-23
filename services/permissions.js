const { PrismaClient } = require('@prisma/client');
const errors = require('../helpers/errors');
const prisma = new PrismaClient();

const getPermissions = async () => {
    try {
        const permissions = await prisma.permisos.findMany();
        return permissions;
    } catch (error) {
        errors.conflictError('Error al obtener los permisos', 'GET_PERMISSIONS_DB', error);
    }
};

const getPermissionsByProfile = async (profile) => {
    try {
        const permissions = await prisma.permisos.findMany({
            where: {
                idPerfil: parseInt(profile)
            }
        });
        return permissions;
    } catch (error) {
        errors.conflictError('Error al obtener los permisos por perfil', 'GET_PERMISSIONS_BY_PROFILE_DB', error);
    }
};

const deletePermission = async (permiso, idPerfil) => {
    try {
        const deletedPermission = await prisma.permisos.delete({
            where: {
                AND: [
                    {
                        permiso: permiso
                    },
                    {
                        idPerfil: parseInt(idPerfil)
                    }
                ]
            }
        });

        return deletedPermission;
    } catch (error) {
        errors.conflictError('Error al eliminar el permiso', 'DELETE_PERMISSION_DB', error);
    }
};

const createPermission = async (permission) => {
    try {
        const newPermission = await prisma.permisos.create({
            data: permission
        });
        return newPermission;
    } catch (error) {
        errors.conflictError('Error al crear el permiso', 'CREATE_PERMISSION_DB', error);
    }
};

const updatePermission = async (permission) => {
    try {
        const updatedPermission = await prisma.permisos.update({
            where: {
                AND: [
                    {
                        permiso: permission.permiso
                    },
                    {
                        idPerfil: parseInt(permission.idPerfil)
                    }
                ]
            },
            data: permission
        });
        return updatedPermission;
    } catch (error) {
        errors.conflictError('Error al actualizar el permiso', 'UPDATE_PERMISSION_DB', error);
    }
};

const deletePermissionsFromProfile = async (idPerfil) => {
    try {
        const deletedPermissions = await prisma.permisos.deleteMany({
            where: {
                idPerfil: parseInt(idPerfil)
            }
        });
        return deletedPermissions;
    } catch (error) {
        errors.conflictError('Error al eliminar los permisos de perfil', 'DELETE_PERMISSIONS_FROM_PROFILE_DB', error);
    }
};

const createPermissions = async (permissions) => {
    try {
        const createdPermissions = await prisma.permisos.createMany({
            data: permissions
        });
        return createdPermissions;
    } catch (error) {
        errors.conflictError('Error al crear los permisos', 'CREATE_PERMISSIONS_DB', error);
    }
};

const permissionsService = {
    getPermissions,
    getPermissionsByProfile,
    deletePermission,
    createPermission,
    updatePermission,
    deletePermissionsFromProfile,
    createPermissions
};

module.exports = permissionsService;
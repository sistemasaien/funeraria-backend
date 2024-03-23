const permissionsService = require('../services/permissions');
const errors = require('../helpers/errors');

const getPermissions = async (req, res, next) => {
    try {
        const permissions = await permissionsService.getPermissions();
        res.status(200).json(permissions);
    } catch (error) {
        next(error);
    }
}

const getPermissionsByProfile = async (req, res, next) => {
    const { profile } = req.params;
    try {
        const permissions = await permissionsService.getPermissionsByProfile(profile);
        res.status(200).json(permissions);
    } catch (error) {
        next(error);
    }
}

const deletePermission = async (req, res, next) => {
    const { permiso, idPerfil } = req.body;
    const permission = { permiso, idPerfil };
    try {
        const deletedPermission = await permissionsService.deletePermission(permission);
        res.status(200).json(deletedPermission);
    } catch (error) {
        next(error);
    }
}

const createPermission = async (req, res, next) => {
    const { permiso, idPerfil, tipo } = req.body;
    const permission = { permiso, idPerfil, tipo };
    try {
        const newPermission = await permissionsService.createPermission(permission);
        res.status(200).json(newPermission);
    } catch (error) {
        next(error);
    }
}

const updatePermission = async (req, res, next) => {
    const { permiso, idPerfil, tipo } = req.body;
    const permission = { permiso, idPerfil, tipo };
    try {
        const permissionToUpdate = await permissionsService.getPermission(id);
        if (!permissionToUpdate) {
            errors.notFoundError('Permiso no encontrado', 'PERMISSION_NOT_FOUND');
        }
        const updatedPermission = await permissionsService.updatePermission(permission);
        res.status(200).json(updatedPermission);
    } catch (error) {
        next(error);
    }
}

const deletePermissionsFromProfile = async (req, res, next) => {
    const { idPerfil } = req.body;
    try {
        const deletedPermissions = await permissionsService.deletePermissionsFromProfile(idPerfil);
        res.status(200).json(deletedPermissions);
    } catch (error) {
        next(error);
    }
}

const createPermissions = async (req, res, next) => {
    const { idPerfil, permisos } = req.body;
    const newPermissions = permisos.map(permiso => ({ permiso, idPerfil, tipo }));
    try {
        const createdPermissions = await permissionsService.createPermissions(newPermissions);
        res.status(200).json(createdPermissions);
    } catch (error) {
        next(error);
    }
}

const updatePermissionsOfProfile = async (req, res, next) => {
    const { profile, permissions } = req.body;
    try {
        await permissionsService.deletePermissionsFromProfile(profile);
        const createdPermissions = await permissionsService.createPermissions(permissions);
        res.status(200).json(createdPermissions);
    } catch (error) {
        next(error);
    }
}

const permissionsController = {
    getPermissions,
    getPermissionsByProfile,
    deletePermission,
    createPermission,
    updatePermission,
    deletePermissionsFromProfile,
    createPermissions,
    updatePermissionsOfProfile
};

module.exports = permissionsController;
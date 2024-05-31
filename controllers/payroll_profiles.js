const payrollProfilesService = require('../services/payroll_profiles')
const packsService = require('../services/packs')
const errors = require('../helpers/errors')

const getPayrollProfiles = async (req, res, next) => {
    try {
        const payrollProfiles = await payrollProfilesService.getPayrollProfiles()
        res.status(200).json(payrollProfiles)
    } catch (error) {
        next(error);
    }
}

const getPayrollProfile = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payrollProfile = await payrollProfilesService.getPayrollProfile(id)
        if (!payrollProfile) {
            errors.notFoundError('Perfil de nómina no encontrado', 'PAYROLL_PROFILE_NOT_FOUND')
        }
        res.status(200).json(payrollProfile)
    } catch (error) {
        next(error);
    }
}

const updatePayrollProfile = async (req, res, next) => {
    const { id, descripcion, sueldoBase, periodicidad, comision, tipo, porcentajeBase, porcentajeEngancheBase } = req.body;
    const payrollProfile = { descripcion, sueldoBase, periodicidad, comision, tipo, porcentajeBase, porcentajeEngancheBase };
    try {

        const payrollProfileToUpdate = await payrollProfilesService.getPayrollProfile(id)
        if (!payrollProfileToUpdate) {
            errors.notFoundError('Perfil de nómina no encontrado', 'PAYROLL_PROFILE_NOT_FOUND')
        }

        const updatedPayrollProfile = await payrollProfilesService.updatePayrollProfile(id, payrollProfile)
        res.status(200).json(updatedPayrollProfile)
    } catch (error) {
        next(error);
    }
}

const createPayrollProfile = async (req, res, next) => {
    //descripcion sueldoBase periodicidad(diario, semanal, catorcenal, quincenal, mensual) comision tipo(fijo/variable)
    const { descripcion, sueldoBase, periodicidad, comision, tipo, porcentajeBase, porcentajeEngancheBase } = req.body;
    const payrollProfile = { descripcion, sueldoBase, periodicidad, comision, tipo, porcentajeBase, porcentajeEngancheBase };
    try {
        const newPayrollProfile = await payrollProfilesService.createPayrollProfile(payrollProfile)
        res.status(200).json(newPayrollProfile)
    } catch (error) {
        next(error);
    }
}

const deletePayrollProfile = async (req, res, next) => {
    const { id } = req.body;
    try {
        const payrollProfileToDelete = await payrollProfilesService.getPayrollProfile(id)
        if (!payrollProfileToDelete) {
            errors.notFoundError('Perfil de nómina no encontrado', 'PAYROLL_PROFILE_NOT_FOUND')
        }

        const deletedPayrollProfile = await payrollProfilesService.deletePayrollProfile(id)
        res.status(200).json(deletedPayrollProfile)
    } catch (error) {
        next(error);
    }
}

const addPackToPayrollProfile = async (req, res, next) => {
    const { id, packId } = req.body;

    try {

        const checkPayrollProfilePack = await payrollProfilesService.getPayrollByProfileAndPack(id, packId)

        if (checkPayrollProfilePack) {
            errors.conflictError('El paquete ya está asignado al perfil de nómina', 'PAYROLL_PROFILE_PACK_ALREADY_EXISTS')
        }

        const payrollProfile = await payrollProfilesService.getPayrollProfile(id)
        if (!payrollProfile) {
            errors.notFoundError('Perfil de nómina no encontrado', 'PAYROLL_PROFILE_NOT_FOUND')
        }

        const pack = await packsService.getPack(packId)
        if (!pack) {
            errors.notFoundError('Paquete no encontrado', 'PACK_NOT_FOUND')
        }

        const item = {
            idPerfil: id,
            idPaquete: packId,
            porcentaje: payrollProfile.porcentajeBase,
            porcentajeEnganche: payrollProfile.porcentajeEngancheBase,
            montoFijo: 0,
            montoFijoEnganche: 0
        }

        const updatedPayrollProfile = await payrollProfilesService.addPayrollProfilePack(item)
        res.status(200).json(updatedPayrollProfile)
    } catch (error) {
        next(error);
    }
}

const getPayrollProfileAndPacks = async (req, res, next) => {
    const { id } = req.params;
    try {
        const payrollProfileAndPacks = await payrollProfilesService.getPayrollProfileAndPacks(id)
        res.status(200).json(payrollProfileAndPacks)
    } catch (error) {
        next(error);
    }
}

const deletePackOfPayrollProfile = async (req, res, next) => {
    const { id, packId } = req.body;
    try {
        const payrollProfilePack = await payrollProfilesService.getPayrollByProfileAndPack(id, packId)
        if (!payrollProfilePack) {
            errors.notFoundError('El paquete no está asignado al perfil de nómina', 'PAYROLL_PROFILE_PACK_NOT_FOUND')
        }

        const deletedPayrollProfilePack = await payrollProfilesService.deletePackOfPayrollProfile(id, packId)
        res.status(200).json(deletedPayrollProfilePack)
    } catch (error) {
        next(error);
    }
}

const updatePackOfPayrollProfile = async (req, res, next) => {
    const { idPerfil, idPaquete, porcentaje, porcentajeEnganche, montoFijo, montoFijoEnganche } = req.body;
    const item = { idPerfil, idPaquete, porcentaje, porcentajeEnganche, montoFijo, montoFijoEnganche };
    try {
        const payrollProfilePack = await payrollProfilesService.getPayrollByProfileAndPack(idPerfil, idPaquete)
        if (!payrollProfilePack) {
            errors.notFoundError('El paquete no está asignado al perfil de nómina', 'PAYROLL_PROFILE_PACK_NOT_FOUND')
        }

        const updatedPayrollProfilePack = await payrollProfilesService.updatePackOfPayrollProfile(item)
        res.status(200).json(updatedPayrollProfilePack)
    } catch (error) {
        next(error);
    }
}


const payrollProfilesController = {
    getPayrollProfiles,
    getPayrollProfile,
    updatePayrollProfile,
    createPayrollProfile,
    deletePayrollProfile,
    addPackToPayrollProfile,
    getPayrollProfileAndPacks,
    deletePackOfPayrollProfile,
    updatePackOfPayrollProfile
}

module.exports = payrollProfilesController;
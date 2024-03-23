const beneficiariesService = require('../services/beneficiaries')
const errors = require('../helpers/errors')

const getBeneficiaries = async (req, res, next) => {
    try {
        const beneficiaries = await beneficiariesService.getBeneficiaries()
        res.status(200).json(beneficiaries)
    } catch (error) {
        next(error);
    }
}

const getBeneficiary = async (req, res, next) => {
    const { id } = req.params;
    try {
        const beneficiary = await beneficiariesService.getBeneficiary(id)
        if (!beneficiary) {
            errors.notFoundError('Beneficiario no encontrado', 'BENEFICIARY_NOT_FOUND')
        }
        res.status(200).json(beneficiary)
    } catch (error) {
        next(error);
    }
}

const updateBeneficiary = async (req, res, next) => {
    const { id, nombre, telefono, fechaNacimiento, parentesco, correo, domicilio, codigoPostal } = req.body;
    const beneficiary = { id, nombre, telefono, fechaNacimiento, parentesco, correo, domicilio, codigoPostal };
    try {

        const beneficiaryToUpdate = await beneficiariesService.getBeneficiary(id)
        if (!beneficiaryToUpdate) {
            errors.notFoundError('Beneficiario no encontrado', 'BENEFICIARY_NOT_FOUND')
        }

        const updatedBeneficiary = await beneficiariesService.updateBeneficiary(id, beneficiary)
        res.status(200).json(updatedBeneficiary)
    } catch (error) {
        next(error);
    }
}

const createBeneficiary = async (req, res, next) => {
    const { nombre, telefono, fechaNacimiento, parentesco, correo, domicilio, codigoPostal } = req.body;
    const beneficiary = { nombre, telefono, fechaNacimiento, parentesco, correo, domicilio, codigoPostal };
    try {
        const newBeneficiary = await beneficiariesService.createBeneficiary(beneficiary)
        res.status(200).json(newBeneficiary)
    } catch (error) {
        next(error);
    }
}

const deleteBeneficiary = async (req, res, next) => {
    const { id } = req.body;
    try {
        const beneficiaryToDelete = await beneficiariesService.getBeneficiary(id)
        if (!beneficiaryToDelete) {
            errors.notFoundError('Beneficiario no encontrado', 'BENEFICIARY_NOT_FOUND')
        }

        const deletedBeneficiary = await beneficiariesService.deleteBeneficiary(id)
        res.status(200).json(deletedBeneficiary)
    } catch (error) {
        next(error);
    }
}

const beneficiariesController = {
    getBeneficiaries,
    getBeneficiary,
    updateBeneficiary,
    createBeneficiary,
    deleteBeneficiary
}

module.exports = beneficiariesController;
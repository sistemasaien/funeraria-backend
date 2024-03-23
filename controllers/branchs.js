const branchsService = require('../services/branchs')
const errors = require('../helpers/errors')
const branchSchema = require('../schemas/branch')
const validateSchema = require('../helpers/validate')

const getBranchs = async (req, res, next) => {
    try {
        const branchs = await branchsService.getBranchs()
        res.status(200).json(branchs)
    } catch (error) {
        next(error);
    }
}

const getBranch = async (req, res, next) => {
    const { id } = req.params;
    try {
        const branch = await branchsService.getBranch(id)
        if (!branch) {
            errors.notFoundError('Sucursal no encontrada', 'BRANCH_NOT_FOUND')
        }
        res.status(200).json(branch)
    } catch (error) {
        next(error);
    }
}

const updateBranch = async (req, res, next) => {
    try {
        await validateSchema(branchSchema, req.body)
        const { id, nombre, direccion, telefono, correo } = req.body;
        const branch = { id, nombre, direccion, telefono, correo };

        const branchToUpdate = await branchsService.getBranch(id)
        if (!branchToUpdate) {
            errors.notFoundError('Sucursal no encontrada', 'BRANCH_NOT_FOUND')
        }

        const updatedBranch = await branchsService.updateBranch(id, branch)
        res.status(200).json(updatedBranch)
    } catch (error) {
        next(error);
    }
}

const createBranch = async (req, res, next) => {
    try {
        await validateSchema(branchSchema, req.body)
        const { nombre, direccion, telefono, correo } = req.body;
        const branch = { nombre, direccion, telefono, correo };
        if (!branch.correo) branch.correo = '';
        const newBranch = await branchsService.createBranch(branch)
        res.status(200).json(newBranch)
    } catch (error) {
        next(error);
    }
}

const deleteBranch = async (req, res, next) => {
    const { id } = req.body;
    try {
        const branchToDelete = await branchsService.getBranch(id)
        if (!branchToDelete) {
            errors.notFoundError('Sucursal no encontrada', 'BRANCH_NOT_FOUND')
        }

        const deletedBranch = await branchsService.deleteBranch(id)
        res.status(200).json(deletedBranch)
    } catch (error) {
        next(error);
    }
}

const branchsController = {
    getBranchs,
    getBranch,
    updateBranch,
    createBranch,
    deleteBranch
}

module.exports = branchsController;
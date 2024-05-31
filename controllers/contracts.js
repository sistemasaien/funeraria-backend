const contractsService = require('../services/contracts')
const clientsService = require('../services/clients')
const requestsService = require('../services/requests')
const servicesService = require('../services/services')
const financingsService = require('../services/financings')
const packsService = require('../services/packs')
const deceasedsService = require('../services/deceaseds')
const ceremoniesService = require('../services/ceremonies')

const errors = require('../helpers/errors')

const getContracts = async (req, res, next) => {
    try {
        const contracts = await contractsService.getContracts()
        res.status(200).json(contracts)
    } catch (error) {
        next(error);
    }
}

const getContract = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contract = await contractsService.getContract(id)
        if (!contract) {
            errors.notFoundError('Contrato no encontrado', 'CONTRACT_NOT_FOUND')
        }
        res.status(200).json(contract)
    } catch (error) {
        next(error);
    }
}

const getCompleteContract = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contract = await contractsService.getCompleteContract(id)
        if (!contract) {
            errors.notFoundError('Contrato no encontrado', 'COMPLETE_CONTRACT_NOT_FOUND')
        }
        res.status(200).json(contract)
    } catch (error) {
        next(error);
    }
}

const updateContract = async (req, res, next) => {
    const { id, idCliente, idFinanciamiento, idSolicitud, idPaquete, fecha, tipo, asesor, estado, impMunicipal, traslado, exhumacion, otros, observaciones, referencia, complementarioBasico, paqueteEspecial, contratoRelacionado } = req.body;
    const contract = { idCliente, idFinanciamiento, idSolicitud, idPaquete, fecha, tipo, asesor, estado, impMunicipal, traslado, exhumacion, otros, observaciones, referencia, complementarioBasico, paqueteEspecial, contratoRelacionado };
    try {
        const contractToUpdate = await contractsService.getContract(id)
        if (!contractToUpdate) {
            errors.notFoundError('Contrato no encontrado', 'CONTRACT_NOT_FOUND')
        }
        const updatedContract = await contractsService.updateContract(id, contract)
        res.status(200).json(updatedContract)
    } catch (error) {
        next(error);
    }
}

const createContract = async (req, res, next) => {
    const { idCliente, idFinanciamiento, idSolicitud, idPaquete, fecha, tipo, asesor, estado, impMunicipal, traslado, exhumacion, otros, observaciones, referencia, complementarioBasico, paqueteEspecial, contratoRelacionado } = req.body;
    const contract = { idCliente, idFinanciamiento, idSolicitud, idPaquete, fecha, tipo, asesor, estado, impMunicipal, traslado, exhumacion, otros, observaciones, referencia, complementarioBasico, paqueteEspecial, contratoRelacionado };
    try {
        const newContract = await contractsService.createBranch(branch)
        res.status(200).json(contract)
    } catch (error) {
        next(error);
    }
}

const deleteContract = async (req, res, next) => {
    const { id } = req.body;
    try {
        const contractToDelete = await contractsService.getContract(id)
        if (!contractToDelete) {
            errors.notFoundError('Contrato no encontrado', 'CONTRACT_NOT_FOUND')
        }
        const deletedContract = await contractsService.deleteContract(id)
        res.status(200).json(deletedContract)
    } catch (error) {
        next(error);
    }
}

const getContractToPrint = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contract = await contractsService.getContract(id)

        if (!contract) {
            errors.notFoundError('Contrato no encontrado', 'CONTRACT_NOT_FOUND')
        }
        const client = await clientsService.getClient(contract.idCliente)
        const request = await requestsService.getRequest(contract.idSolicitud)
        const service = await servicesService.getService(request.idServicio)
        const pack = await packsService.getPack(request.idPaquete)
        const financing = await financingsService.getFinancing(contract.idFinanciamiento)
        let deceased = {}
        if (contract?.tipo === 'Inmediato') {
            deceased = await deceasedsService.getDeceased(request.idFallecido)
        }
        let ceremony = {}
        if (request?.idCeremonia) {
            ceremony = await ceremoniesService.getCeremony(request.idCeremonia)
        }
        const completeContract = {
            contrato: contract,
            cliente: client,
            solicitud: request,
            servicio: service,
            paquete: pack,
            financiamiento: financing,
            fallecido: deceased,
            ceremonia: ceremony
        }

        res.status(200).json(completeContract)
    } catch (error) {
        next(error);
    }
}

const contractsController = {
    getContracts,
    getContract,
    getCompleteContract,
    updateContract,
    createContract,
    deleteContract,
    getContractToPrint
}

module.exports = contractsController;
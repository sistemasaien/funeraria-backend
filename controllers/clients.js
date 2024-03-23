const clientsService = require('../services/clients')
const errors = require('../helpers/errors')
const validateSchema = require('../helpers/validate')
const clientSchema = require('../schemas/client')

const getClients = async (req, res, next) => {
    try {
        const clients = await clientsService.getClients()
        res.status(200).json(clients)
    } catch (error) {
        next(error);
    }
}

const getClient = async (req, res, next) => {
    const { id } = req.params;
    try {
        const client = await clientsService.getClient(id)
        if (!client) {
            errors.notFoundError('Cliente no encontrado', 'CLIENT_NOT_FOUND')
        }
        res.status(200).json(client)
    } catch (error) {
        next(error);
    }
}

const updateClient = async (req, res, next) => {
    try {
        await validateSchema(clientSchema, req.body)
        const { id, codigoPostal, correo, domicilio, domicilioCobranza, estadoCivil, fechaDesde, fechaNacimiento, localidad, municipio, estado, nombre, ocupacion, referenciaDomicilioCobranza, telefono, telefonoCobranza } = req.body;
        const client = { id, codigoPostal, correo, domicilio, domicilioCobranza, estadoCivil, fechaDesde, fechaNacimiento, localidad, municipio, estado, nombre, ocupacion, referenciaDomicilioCobranza, telefono, telefonoCobranza };
        const clientToUpdate = await clientsService.getClient(id)
        if (!clientToUpdate) {
            errors.notFoundError('Cliente no encontrado', 'CLIENT_NOT_FOUND')
        }

        const updatedClient = await clientsService.updateClient(id, client)
        res.status(200).json(updatedClient)
    } catch (error) {
        next(error);
    }
}

const createClient = async (req, res, next) => {
    try {
        await validateSchema(clientSchema, req.body)
        const { codigoPostal, correo, domicilio, domicilioCobranza, estadoCivil, fechaDesde, estado, fechaNacimiento, localidad, municipio, nombre, ocupacion, referenciaDomicilioCobranza, telefono, telefonoCobranza } = req.body;
        const client = { codigoPostal, correo, domicilio, domicilioCobranza, estadoCivil, fechaDesde, estado, fechaNacimiento, localidad, municipio, nombre, ocupacion, referenciaDomicilioCobranza, telefono, telefonoCobranza };
        const newClient = await clientsService.createClient(client)
        res.status(200).json(newClient)
    } catch (error) {
        next(error);
    }
}

const deleteClient = async (req, res, next) => {
    const { id } = req.body;
    try {
        const clientToDelete = await clientsService.getClient(id)
        if (!clientToDelete) {
            errors.notFoundError('Cliente no encontrado', 'CLIENT_NOT_FOUND')
        }

        const deletedClient = await clientsService.deleteClient(id)
        res.status(200).json(deletedClient)
    } catch (error) {
        next(error);
    }
}

const getClientByNameAndBirthDate = async (req, res, next) => {
    const { nombre, fechaNacimiento } = req.body;
    try {
        const client = await clientsService.getClientByNameAndBirthDate(nombre, fechaNacimiento)
        if (!client) {
            errors.notFoundError('Cliente no encontrado', 'CLIENT_NOT_FOUND')
        }
        res.status(200).json(client)
    } catch (error) {
        next(error);
    }
}

const clientsController = {
    getClients,
    getClient,
    updateClient,
    createClient,
    deleteClient,
    getClientByNameAndBirthDate
}


module.exports = clientsController;
const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getClients = async () => {
    try {
        const clients = await prisma.clientes.findMany({
            select: {
                id: true,
                nombre: true,
                domicilio: true,
                localidad: true,
                fechaDesde: true,
                telefono: true,
                telefonoCobranza: true
            }
        });
        return clients
    } catch (error) {
        errors.conflictError('Error al obtener los clientes', 'GET_CLIENTS_DB', error)
    }
}

const getClient = async (id) => {
    try {
        const client = await prisma.clientes.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return client
    } catch (error) {
        errors.conflictError('Error al obtener el cliente', 'GET_CLIENT_DB', error)
    }
}

const createClient = async (client) => {
    try {
        const newClient = await prisma.clientes.create({
            data: client
        })
        return newClient
    } catch (error) {
        errors.conflictError('Error al crear el cliente', 'CREATE_CLIENT_DB', error)
    }
}

const updateClient = async (id, client) => {
    try {
        const updatedClient = await prisma.clientes.update({
            where: {
                id: parseInt(id)
            },
            data: client
        })
        return updatedClient
    } catch (error) {
        errors.conflictError('Error al actualizar el cliente', 'UPDATE_CLIENT_DB', error)
    }
}

const deleteClient = async (id) => {
    try {
        const deletedClient = await prisma.clientes.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedClient
    } catch (error) {
        errors.conflictError('Error al eliminar el cliente', 'DELETE_CLIENT_DB', error)
    }
}

const getClientByNameAndBirthDate = async (name, birthDate) => {
    try {
        const client = await prisma.clientes.findFirst({
            where: {
                nombre: name,
                fechaNacimiento: birthDate
            }
        })
        return client
    } catch (error) {
        errors.conflictError('Error al obtener el cliente', 'GET_CLIENT_DB', error)
    }
}

const clientsService = {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    getClientByNameAndBirthDate
}

module.exports = clientsService;
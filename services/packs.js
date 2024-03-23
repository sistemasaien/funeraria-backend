const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getPacks = async () => {
    try {
        const packs = await prisma.paquetes.findMany()
        return packs
    } catch (error) {
        errors.conflictError('Error al obtener los paquetes', 'GET_PACKS_DB', error)
    }
}

const getPack = async (id) => {
    try {
        const pack = await prisma.paquetes.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        return pack
    } catch (error) {
        errors.conflictError('Error al obtener el paquete', 'GET_PACK_DB', error)
    }
}

const createPack = async (pack) => {
    try {
        const newPack = await prisma.paquetes.create({
            data: pack
        })
        return newPack
    } catch (error) {
        errors.conflictError('Error al crear el paquete', 'CREATE_PACK_DB', error)
    }
}

const updatePack = async (id, pack) => {
    try {
        const updatedPack = await prisma.paquetes.update({
            where: {
                id: parseInt(id)
            },
            data: pack
        })
        return updatedPack
    } catch (error) {
        errors.conflictError('Error al actualizar el paquete', 'UPDATE_PACK_DB', error)
    }
}

const deletePack = async (id) => {
    try {
        const deletedPack = await prisma.paquetes.delete({
            where: {
                id: parseInt(id)
            }
        })
        return deletedPack
    } catch (error) {
        errors.conflictError('Error al eliminar el paquete', 'DELETE_PACK_DB', error)
    }
}

const getPackByName = async (name) => {
    try {
        const pack = await prisma.paquetes.findFirst({
            where: {
                nombrePaquete: name
            }
        })
        return pack
    } catch (error) {
        errors.conflictError('Error al obtener el paquete', 'GET_PACK_DB', error)
    }
}

const packsService = {
    getPacks,
    getPack,
    createPack,
    updatePack,
    deletePack,
    getPackByName
}

module.exports = packsService;
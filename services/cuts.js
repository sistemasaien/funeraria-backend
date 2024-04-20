const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const getCuts = async () => {
    try {
        const cuts = await prisma.$queryRaw`SELECT c.*, e.nombre empleado
        FROM cortes c
        left join empleados e
        on c.idEmpleado = e.id`
        return cuts
    } catch (error) {
        errors.conflictError('Error al obtener los cortes', 'GET_CUTS_DB', error)
    }
}

const getCut = async (id) => {
    try {
        const cut = await prisma.$queryRaw`SELECT c.*, e.nombre as nombreEmpleado FROM cortes c, empleados e WHERE c.idEmpleado = e.id AND c.id = ${id}`
        if (cut?.length === 1) {
            return cut[0]
        }
        return cut
    } catch (error) {
        errors.conflictError('Error al obtener el corte', 'GET_CUT_DB', error)
    }
}

const createCut = async (cut) => {
    try {
        const newCut = await prisma.cortes.create({
            data: cut
        })
        return newCut
    } catch (error) {
        errors.conflictError('Error al crear el corte', 'CREATE_CUT_DB', error)
    }
}

const updateCut = async (id, cut) => {
    try {
        const updatedCut = await prisma.cortes.update({
            where: {
                id: parseInt(id)
            },
            data: cut
        })
        return updatedCut
    } catch (error) {
        errors.conflictError('Error al actualizar el corte', 'UPDATE_CUT_DB', error)
    }
}

const cutsService = {
    getCuts,
    getCut,
    createCut,
    updateCut
}

module.exports = cutsService
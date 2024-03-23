const { PrismaClient } = require('@prisma/client')
const errors = require('../helpers/errors')
const prisma = new PrismaClient()

const createSalesWay = async (salesWay) => {
    try {
        const newSalesWay = await prisma.recorridos_ventas.create({
            data: salesWay
        })
        return newSalesWay
    } catch (error) {
        errors.conflictError('Error al crear la forma de venta', 'CREATE_SALES_WAY_DB', error)
    }
}

const getLastOrder = async (idRecorrido) => {
    try {
        const lastOrder = await prisma.recorridos_ventas.findFirst({
            where: {
                idRecorrido: parseInt(idRecorrido)
            },
            orderBy: {
                orden: 'desc'
            }
        })
        return lastOrder
    } catch (error) {
        errors.conflictError('Error al obtener el último orden', 'GET_LAST_ORDER_DB', error)
    }
}

const createManySalesWay = async (salesWay) => {
    try {
        const newSalesWay = await prisma.recorridos_ventas.createMany({
            data: salesWay
        })
        return newSalesWay
    } catch (error) {
        errors.conflictError('Error al crear las rutas', 'CREATE_MANY_SALES_WAY_DB', error)
    }
}

const substractOrder = async (query) => {
    try {
        let result = await prisma.$queryRaw`${query}`
        return result
    } catch (error) {
        errors.conflictError('Error al actualizar el orden', 'SUBSTRACT_ORDER_DB', error)
    }
}

const deleteSalesWayByWay = async (idRecorrido) => {
    try {
        const deletedSalesWay = await prisma.recorridos_ventas.deleteMany({
            where: {
                idRecorrido: parseInt(idRecorrido)
            }
        })
        return deletedSalesWay
    } catch (error) {
        errors.conflictError('Error al eliminar la ruta de venta', 'DELETE_SALES_WAY_DB', error)
    }
}

const deleteSalesWaysBySale = async (idVenta) => {
    try {
        const deletedSalesWay = await prisma.recorridos_ventas.deleteMany({
            where: {
                idVenta: parseInt(idVenta)
            }
        })
        return deletedSalesWay
    } catch (error) {
        errors.conflictError('Error al eliminar la ruta de venta', 'DELETE_SALES_WAY_DB', error)
    }
}

const getSalesWaysByWay = async (idRecorrido) => {
    try {
        const salesWays = await prisma.recorridos_ventas.findMany({
            where: {
                idRecorrido: parseInt(idRecorrido)
            }
        })
        return salesWays
    } catch (error) {
        errors.conflictError('Error al obtener las rutas de venta', 'GET_SALES_WAYS_DB', error)
    }
}

const salesWayService = {
    createSalesWay,
    getLastOrder,
    createManySalesWay,
    substractOrder,
    deleteSalesWayByWay,
    deleteSalesWaysBySale,
    getSalesWaysByWay
}

module.exports = salesWayService
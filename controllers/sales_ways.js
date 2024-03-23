const errors = require('../helpers/errors')
const salesWaysService = require('../services/sales_ways')

const createSalesWays = async (req, res, next) => {
    const { idRecorrido, idVenta, orden } = req.body;
    try {
        const newSalesWay = await salesWaysService.createSalesWay({ idRecorrido, idVenta, orden })
        res.status(200).send({ message: 'Ruta de venta creada correctamente', success: true, insertedId: newSalesWay.id })
    } catch (error) {
        next(error)
    }
}

const getLastOrder = async (req, res, next) => {
    const { id } = req.params;
    try {
        const lastOrder = await salesWaysService.getLastOrder(id)
        res.status(200).send({ orden: lastOrder.orden, success: true })
    } catch (error) {
        next(error)
    }
}

const createManySalesWays = async (req, res, next) => {
    const { recorridos } = req.body;
    try {
        await salesWaysService.createManySalesWay(recorridos)
        res.status(200).send({ message: 'Rutas creadas correctamente', success: true })
    } catch (error) {
        next(error)
    }
}

const substractOrder = async (req, res, next) => {
    const { id, firstOrder } = req.body;
    const query = `UPDATE recorridos_ventas SET orden = orden - 1 WHERE idRecorrido = ${id} AND orden > ${firstOrder}`;
    try {
        await salesWaysService.substractOrder(query);
        res.status(200).send({ message: 'Ruta actualizada correctamente', success: true });
    } catch (error) {
        next(error);
    }
}

const deleteSalesWayByWay = async (req, res, next) => {
    const { idRecorrido } = req.body;
    try {
        await salesWaysService.deleteSalesWayByWay(idRecorrido);
        res.status(200).send({ message: 'Ruta eliminada correctamente', success: true });
    } catch (error) {
        next(error);
    }
}

const deleteSalesWaysBySale = async (req, res, next) => {
    const { idVenta } = req.body;
    try {
        await salesWaysService.deleteSalesBySale(idVenta);
        res.status(200).send({ message: 'Ruta eliminada correctamente', success: true });
    } catch (error) {
        next(error);
    }
}

const getSalesWaysByWay = async (req, res, next) => {
    const { id } = req.params;
    try {
        const salesWays = await salesWaysService.getSalesWaysByWay(id);
        res.status(200).send(salesWays);
    } catch (error) {
        next(error);
    }
}

const salesWaysController = {
    createSalesWays,
    getLastOrder,
    substractOrder,
    createManySalesWays,
    deleteSalesWayByWay,
    deleteSalesWaysBySale,
    getSalesWaysByWay
}

module.exports = salesWaysController
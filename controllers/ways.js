const waysService = require('../services/ways');

const getWays = async (req, res, next) => {
    try {
        const ways = await waysService.getWays();
        res.status(200).send(ways);
    } catch (error) {
        next(error)
    }
}

const getWay = async (req, res, next) => {
    const { id } = req.params;
    try {
        const way = await waysService.getWay(id);
        res.status(200).send(way);
    } catch (error) {
        next(error)
    }
}

const createWay = async (req, res, next) => {
    const { nombre, descripcion } = req.body;
    try {
        const newWay = await waysService.createWay({ nombre, descripcion });
        res.status(200).send({ message: 'Ruta creada correctamente', success: true, insertedId: newWay.id });
    } catch (error) {
        next(error)
    }
}

const updateWay = async (req, res, next) => {
    const { nombre, descripcion, id } = req.body;
    try {
        const updatedWay = await waysService.updateWay(id, { nombre, descripcion });
        res.status(200).send({ message: 'Ruta actualizada correctamente', success: true });
    } catch (error) {
        next(error)
    }
}

const deleteWay = async (req, res, next) => {
    const { id } = req.body;
    try {
        const deletedWay = await waysService.deleteWay(id);
        res.status(200).send({ message: 'Ruta eliminada correctamente', success: true });
    } catch (error) {
        next(error)
    }
}

const getCompleteWay = async (req, res, next) => {
    const { id } = req.params;
    try {
        const way = await waysService.getCompleteWay(id);
        res.status(200).send({ wayData: way, success: true });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getWays,
    getWay,
    createWay,
    updateWay,
    deleteWay,
    getCompleteWay
}

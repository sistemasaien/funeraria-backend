const { PrismaClient } = require('@prisma/client');
const errors = require('../helpers/errors');
const prisma = new PrismaClient();

const getWays = async () => {
    try {
        const ways = await prisma.recorridos.findMany();
        return ways;
    } catch (error) {
        errors.conflictError('Error al obtener los recorridos', 'GET_WAYS_DB', error);
    }
};

const getWay = async (id) => {
    try {
        const way = await prisma.recorridos.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return way;
    } catch (error) {
        errors.conflictError('Error al obtener el recorrido', 'GET_WAY_DB', error);
    }
};

const createWay = async (way) => {
    try {
        const newWay = await prisma.recorridos.create({
            data: way
        });
        return newWay;
    } catch (error) {
        errors.conflictError('Error al crear el recorrido', 'CREATE_WAY_DB', error);
    }
};

const updateWay = async (id, way) => {
    try {
        const updatedWay = await prisma.recorridos.update({
            where: {
                id: parseInt(id)
            },
            data: way
        });
        return updatedWay;
    } catch (error) {
        errors.conflictError('Error al actualizar el recorrido', 'UPDATE_WAY_DB', error);
    }
};

const deleteWay = async (id) => {
    try {
        const deletedWay = await prisma.recorridos.delete({
            where: {
                id: parseInt(id)
            }
        });
        return deletedWay;
    } catch (error) {
        errors.conflictError('Error al eliminar el recorrido', 'DELETE_WAY_DB', error);
    }
};

const getCompleteWay = async (id) => {
    try {
        let way = await prisma.$queryRaw`SELECT nombre_cliente, direccion_cliente, fecha, valor, orden, id_venta, id_cuota, importePendiente, id_contrato, id_cliente, montoFinanciado, periodo, nroCuota, importeAbonado, importeTotal, numeroPagos
        FROM (
          SELECT c.nombre AS nombre_cliente, c.domicilio AS direccion_cliente, c.id AS id_cliente, co.fecha, co.valor, rv.orden, v.id AS id_venta, co.id AS id_cuota, co.nroCuota, f.montoFinanciado, f.periodo, f.importePendiente, f.idContrato AS id_contrato, f.importeAbonado, f.importeTotal, f.numeroPagos,
                 ROW_NUMBER() OVER (PARTITION BY v.id ORDER BY co.fecha ASC) AS row_num
          FROM clientes c
          JOIN ventas v ON c.id = v.idCliente
          JOIN recorridos_ventas rv ON v.id = rv.idVenta
          JOIN cobranzas co ON v.idFinanciamiento = co.idFinanciamiento
          JOIN financiamientos f ON f.id = v.idFinanciamiento
          WHERE co.estado = 'Pendiente' AND rv.idRecorrido = ${id}
          ORDER BY rv.orden 
        ) subquery
        WHERE row_num = 1;`
        return way;
    } catch (error) {
        errors.conflictError('Error al obtener la ruta completa', 'GET_COMPLETE_WAY_DB', error);

    }
}

const waysService = {
    getWays,
    getWay,
    createWay,
    updateWay,
    deleteWay,
    getCompleteWay
};

module.exports = waysService;

const { connection } = require('../controllers');

const getWays = async (req, res) => {
    const response = await connection.query('SELECT * FROM recorridos', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getWay = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM recorridos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send(rows[0]);
        } else {
            res.status(200).send({ message: 'No se encontró el recorrido', success: false });
        }
    });
}

const createWay = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const response = await connection.query(`INSERT INTO recorridos (nombre, descripcion) VALUES ('${nombre}', '${descripcion}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const updateWay = async (req, res) => {
    const { nombre, descripcion, id } = req.body;
    const response = await connection.query(`UPDATE recorridos SET nombre = '${nombre}', descripcion = '${descripcion}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteWay = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM recorridos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const insertMassiveSalesWays = async (req, res) => {
    const { recorridos } = req.body;
    query = 'INSERT INTO recorridos_ventas (idRecorrido, idVenta, orden) VALUES'
    recorridos.forEach((r) => {
        query += `('${r.idRecorrido}', '${r.idVenta}', '${r.orden}'),`;
    });
    query = query.slice(0, -1);
    const response = await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteSalesWays = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM recorridos_ventas WHERE idRecorrido = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const createSalesWays = async (req, res) => {
    const { idRecorrido, idVenta, orden } = req.body;
    const response = await connection.query(`INSERT INTO recorridos_ventas (idRecorrido, idVenta, orden) VALUES ('${idRecorrido}', '${idVenta}', '${orden}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Recorrido creado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getLastOrder = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT MAX(orden) as orden FROM recorridos_ventas WHERE idRecorrido = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ orden: rows[0].orden, success: true });
        }
    });
}

const substractOrder = async (req, res) => {
    const { id, firstOrder } = req.body;
    const response = await connection.query(`UPDATE recorridos_ventas SET orden = orden - 1 WHERE idRecorrido = ${id} AND orden > ${firstOrder}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send({ message: 'Recorrido actualizado correctamente', success: true });
        }
    });
}

module.exports = {
    getWays,
    getWay,
    createWay,
    updateWay,
    deleteWay,
    deleteSalesWays,
    createSalesWays,
    insertMassiveSalesWays,
    getLastOrder,
    substractOrder
}

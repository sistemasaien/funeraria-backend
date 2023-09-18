const { connection } = require('../controllers');
const moment = require('moment');

const getCuts = async (req, res) => {
    const response = await connection.query(`SELECT c.*, e.nombre empleado
    FROM cortes c
    left join empleados e
    on c.idEmpleado = e.id`
        , function (err, rows) {
            if (err) {
                res.status(409).send(err);
            } else {
                res.status(200).send(rows);
            }
        });
}

const createCut = async (req, res) => {
    const { idEmpleado, monto, cantidadCobros } = req.body;
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    const estado = 'Pendiente';

    const response = await connection.query(`INSERT INTO cortes (idEmpleado, monto, cantidadCobros, fecha, estado) VALUES ('${idEmpleado}', '${monto}', '${cantidadCobros}', '${datetime}', '${estado}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Corte creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getCut = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM cortes WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send(rows[0]);
        } else {
            res.status(200).send({ message: 'No se encontró el corte', success: false });
        }
    });
}

const updateCutStatus = async (req, res) => {
    const { id, estado } = req.body;
    const response = await connection.query(`UPDATE cortes SET estado = '${estado}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Corte actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

module.exports = {
    getCuts,
    createCut,
    getCut,
    updateCutStatus
}

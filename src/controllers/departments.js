const { connection } = require('../controllers');

const getDepartments = async (req, res) => {
    const response = await connection.query('SELECT * FROM departamentos', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const createDepartment = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const response = await connection.query(`INSERT INTO departamentos (nombre, descripcion) VALUES ('${nombre}', '${descripcion}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Departamento creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getDepartment = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM departamentos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el departamento', success: false });
            }
        }
    });
}
const updateDepartment = async (req, res) => {
    const { id, nombre, descripcion } = req.body;
    const response = await connection.query(`UPDATE departamentos SET nombre = '${nombre}', descripcion = '${descripcion}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Departamento actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteDepartment = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM departamentos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Departamento eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}


module.exports = {
    getDepartments,
    createDepartment,
    getDepartment,
    updateDepartment,
    deleteDepartment
}
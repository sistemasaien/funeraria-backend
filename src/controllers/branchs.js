const { connection } = require('../controllers');

const getBranchs = async (req, res) => {
    const response = await connection.query('SELECT * FROM sucursales', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const createBranch = async (req, res) => {
    const { nombre, direccion, telefono, correo } = req.body;
    const response = await connection.query(`INSERT INTO sucursales (nombre, direccion, telefono, correo) VALUES ('${nombre}', '${direccion}', '${telefono}', '${correo}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Sucursal creada correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getBranch = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM sucursales WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send(rows[0]);
        } else {
            res.status(200).send({ message: 'No se encontró la sucursal', success: false });
        }
    });
}

const updateBranch = async (req, res) => {
    const { id, nombre, direccion, telefono, correo } = req.body;
    const response = await connection.query(`UPDATE sucursales SET nombre = '${nombre}', direccion = '${direccion}', telefono = '${telefono}', correo = '${correo}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Sucursal actualizada correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteBranch = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM sucursales WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Sucursal eliminada correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}


module.exports = {
    getBranchs,
    createBranch,
    getBranch,
    updateBranch,
    deleteBranch
}
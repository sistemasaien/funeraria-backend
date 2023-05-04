const { connection } = require('../controllers');

const getPacks = async (req, res) => {
    const response = await connection.query('SELECT * FROM paquetes', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getPack = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM paquetes WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send(rows[0]);
        } else {
            res.status(200).send({ message: 'No se encontró el paquete', success: false });
        }
    });
}

const updatePack = async (req, res) => {
    //id 	nombrePaquete 	precioPaquete 	ataudModelo 	capilla 	
    const { id, nombrePaquete, precioPaquete, ataudModelo, capilla } = req.body;
    const response = await connection.query(`UPDATE paquetes SET nombrePaquete = '${nombrePaquete}', precioPaquete = '${precioPaquete}', ataudModelo = '${ataudModelo}', capilla = '${capilla}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Paquete actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const createPack = async (req, res) => {
    const { nombrePaquete, precioPaquete, ataudModelo, capilla } = req.body;
    const response = await connection.query(`INSERT INTO paquetes (nombrePaquete, precioPaquete, ataudModelo, capilla) VALUES ('${nombrePaquete}', '${precioPaquete}', '${ataudModelo}', '${capilla}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Paquete creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deletePack = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM paquetes WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Paquete eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

module.exports = {
    getPacks,
    getPack,
    updatePack,
    createPack,
    deletePack
}
const { connection } = require('../controllers');

const getClients = async (req, res) => {
    const response = await connection.query('SELECT * FROM clientes', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getClient = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM clientes WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send(rows[0]);
        } else {
            res.status(200).send({ message: 'No se encontró el cliente', success: false });
        }
    });
}

const updateClient = async (req, res) => {
    const { id, codigoPostal, correo, domicilio, domicilioCobranza, estadoCivil, fechaDesde, fechaNacimiento, localidad, municipio, nombre, ocupacion, referenciaDomicilioCobranza, telefono, telefonoCobranza } = req.body;
    const response = await connection.query(`UPDATE clientes SET codigoPostal = '${codigoPostal}', correo = '${correo}', domicilio = '${domicilio}', domicilioCobranza = '${domicilioCobranza}', estadoCivil = '${estadoCivil}', fechaDesde = '${fechaDesde}', fechaNacimiento = '${fechaNacimiento}', localidad = '${localidad}', municipio = '${municipio}', nombre = '${nombre}', ocupacion = '${ocupacion}', referenciaDomicilioCobranza = '${referenciaDomicilioCobranza}', telefono = '${telefono}', telefonoCobranza = '${telefonoCobranza}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Cliente actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const createClient = async (req, res) => {
    const { codigoPostal, correo, domicilio, domicilioCobranza, estadoCivil, fechaDesde, fechaNacimiento, localidad, municipio, nombre, ocupacion, referenciaDomicilioCobranza, telefono, telefonoCobranza } = req.body;
    const response = await connection.query(`INSERT INTO clientes (codigoPostal, correo, domicilio, domicilioCobranza, estadoCivil, fechaDesde, fechaNacimiento, localidad, municipio, nombre, ocupacion, referenciaDomicilioCobranza, telefono, telefonoCobranza) VALUES ('${codigoPostal}', '${correo}', '${domicilio}', '${domicilioCobranza}', '${estadoCivil}', '${fechaDesde}', '${fechaNacimiento}', '${localidad}', '${municipio}', '${nombre}', '${ocupacion}', '${referenciaDomicilioCobranza}', '${telefono}', '${telefonoCobranza}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Cliente creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteClient = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM clientes WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Cliente eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

module.exports = {
    getClients,
    getClient,
    updateClient,
    createClient,
    deleteClient
}
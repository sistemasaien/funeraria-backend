const { connection } = require('../controllers');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    const response = await connection.query('SELECT u.id, usuario, u.nombre, email, p.nombre as perfil FROM usuarios u, perfiles p WHERE p.id = u.perfil', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getUser = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM usuarios WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows[0]);
            } else {
                res.status(200).send({ message: 'No se encontró el usuario', success: false });
            }
        }
    });
}

const updateUser = async (req, res) => {
    const { id, usuario, password, perfil, nombre, email } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const response = await connection.query(`UPDATE usuarios SET usuario = '${usuario}', password = '${hash}', perfil = '${perfil}', nombre = '${nombre}', email = '${email}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Usuario actualizado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const createUser = async (req, res) => {
    const { usuario, password, perfil, nombre, email } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const response = await connection.query(`INSERT INTO usuarios (usuario, password, perfil, nombre, email) VALUES ('${usuario}', '${hash}', '${perfil}', '${nombre}', '${email}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Usuario creado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const deleteUser = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM usuarios WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Usuario eliminado correctamente', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    createUser,
    deleteUser
}
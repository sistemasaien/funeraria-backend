const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

connection.connect(function (err) {
    // en caso de error
    if (err) {
        console.log('ERROR:', err.code);
        console.log('ERROR2:', err.fatal);
    }
});

const register = async (req, res) => {
    const { username, password, phone, mail, name } = req.body;
    const response = await connection.query(`INSERT INTO users (username, password, role, phone, mail, name) VALUES ('${username}', '${password}', ${2}, '${phone}', '${mail}', '${name}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.affectedRows > 0) {
            res.status(200).send({ message: 'Usuario registrado correctamente', success: true });
        } else {
            res.status(200).send({ message: 'Ocurrió un error', success: false });
        }
    });
}

const updateUser = async (req, res) => {
    const { username, password, phone, mail, name } = req.body;
    const response = await connection.query(`UPDATE users SET username = '${username}', password = '${password}', phone = '${phone}', mail = '${mail}', name = '${name}' WHERE username = '${username}'`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.affectedRows > 0) {
            res.status(200).send({ message: 'Usuario actualizado correctamente', success: true });
        } else {
            res.status(200).send({ message: 'Ocurrió un error', success: false });
        }
    });
}

const deleteUser = async (req, res) => {
    const { username } = req.body;
    const response = await connection.query(`DELETE FROM users WHERE username = '${username}'`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.affectedRows > 0) {
            res.status(200).send({ message: 'Usuario eliminado correctamente', success: true });
        } else {
            res.status(200).send({ message: 'Ocurrió un error', success: false });
        }
    });
}

const login = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    await connection.query(`SELECT * FROM users where username = '${username}' and password= '${password}'`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send({ message: 'Usuario logueado correctamente', success: true, user: rows[0] });
        } else {
            res.status(200).send({ message: 'Usuario o contraseña incorrectos', success: false });
        }
    });
}

const getRequests = async (req, res) => {
    const response = await connection.query('SELECT * FROM solicitudes ORDER BY ID DESC', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }

        res.status(200).send(rows);
    });
}

const getContracts = async (req, res) => {
    const response = await connection.query('SELECT * FROM contratos ORDER BY ID DESC', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }

        res.status(200).send(rows);
    });
}

const insertContract = async (req, res) => {
    const { data } = req.body;
    const date = new Date();
    let parsedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const response = await connection.query(`INSERT INTO contratos (data, date) VALUES ('${data}', '${parsedDate}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
    });

    res.status(200).send('ok');
}

const insertRequest = async (req, res) => {
    const { data } = req.body;
    const date = new Date();
    let parsedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    const response = await connection.query(`INSERT INTO solicitudes (data, date) VALUES ('${data}', '${parsedDate}')`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
    });

    res.status(200).send('ok');
}

const updateContract = async (req, res) => {
    const { id, data } = req.body;
    const response = await connection.query(`UPDATE contratos SET data = '${data}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.affectedRows > 0) {
            res.status(200).send({ message: 'Contrato actualizado correctamente', success: true });
        } else {
            res.status(200).send({ message: 'No se encontró el contrato', success: false });
        }
    });
}

const updateRequest = async (req, res) => {
    const { id, data } = req.body;
    const response = await connection.query(`UPDATE solicitudes SET data = '${data}' WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.affectedRows > 0) {
            res.status(200).send({ message: 'Solicitud actualizada correctamente', success: true });
        } else {
            res.status(200).send({ message: 'No se encontró la solicitud', success: false });
        }
    });
}

const getRequest = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM solicitudes WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send(rows[0]);
        } else {
            res.status(200).send({ message: 'No se encontró la solicitud', success: false });
        }
    });
}

const getUsers = async (req, res) => {
    const response = await connection.query('SELECT * FROM users', function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const getContract = async (req, res) => {
    const { id } = req.params;
    const response = await connection.query(`SELECT * FROM contratos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.length > 0) {
            res.status(200).send(rows[0]);
        } else {
            res.status(200).send({ message: 'No se encontró el contrato', success: false });
        }
    });
}

const deleteContract = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM contratos WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.affectedRows > 0) {
            res.status(200).send({ message: 'Contrato eliminado correctamente', success: true });
        } else {
            res.status(200).send({ message: 'No se encontró el contrato', success: false });
        }
    });
}

const deleteRequest = async (req, res) => {
    const { id } = req.body;
    const response = await connection.query(`DELETE FROM solicitudes WHERE id = ${id}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        }
        if (rows?.affectedRows > 0) {
            res.status(200).send({ message: 'Solicitud eliminada correctamente', success: true });
        } else {
            res.status(200).send({ message: 'No se encontró la solicitud', success: false });
        }
    });
}




module.exports = { login, register, getRequests, getContracts, insertContract, insertRequest, updateContract, updateRequest, getContract, getRequest, updateUser, deleteUser, getUsers, deleteContract, deleteRequest }

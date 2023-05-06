const mysql = require('mysql');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    keepAlive: true
});

//getConnection
connection = pool.getConnection(function (err, connection) {
    if (err) {
        connection.release();
        console.error('Error al conectarse a la base de datos:', err);
        setTimeout(connect, 2000); // intenta reconectar después de 2 segundos
    } else {
        console.log('Conexión establecida con la base de datos');
    }
});

module.exports = pool;
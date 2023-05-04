const mysql = require('mysql');

let connection;

function connect() {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        keepAlive: true
    });

    connection.connect((error) => {
        if (error) {
            console.error('Error al conectarse a la base de datos:', error);
            setTimeout(connect, 2000); // intenta reconectar después de 2 segundos
        } else {
            console.log('Conexión establecida con la base de datos');
        }
    });

    connection.on('error', (error) => {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexión con la base de datos se perdió');
            connect(); // intenta reconectar
        } else {
            throw error;
        }
    });
}

connect();

module.exports = connection;
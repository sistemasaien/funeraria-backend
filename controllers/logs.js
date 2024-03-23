const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const errors = require('../helpers/errors');

const getLogs = async (req, res, next) => {
    try {
        // Directorio que queremos comprimir
        const directoryPath = path.join(__dirname, '..', 'logs');

        // Crear un objeto de archiver
        const archive = archiver('zip', { zlib: { level: 9 } });

        // Configurar el encabezado de la respuesta
        res.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename=logs.zip`
        });

        // Enviar la respuesta
        archive.pipe(res);

        // Añadir los archivos de la carpeta "logs" al zip
        archive.directory(directoryPath, 'logs');

        // Finalizar el proceso de archiver y enviar la respuesta
        archive.finalize();
    } catch (error) {
        // Manejar errores
        errors.conflictError('Error al obtener los logs', 'GET_LOGS', error)
    }
}

module.exports = {
    getLogs
}
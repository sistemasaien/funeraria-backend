const fs = require('fs');
const moment = require('moment');

const logsDir = './logs/';

const logError = (error) => {
    const now = moment();
    const logFileName = `${now.format('DD_MM_YYYY')}.log`;
    const logFilePath = logsDir + logFileName;

    let basePath = global.__basedir;
    // Sustituir \ por \\
    basePath = basePath.replace(/\\/g, '\\\\');
    let formattedError = JSON.stringify(error, null, 2)
        .replaceAll('\\node_modules', '\\pode_modules') // Reemplazar \node_modules por \pode_modules para que no se interprete como un salto de línea
        .replaceAll(/\\n/g, '\n') // Reemplazar \n por saltos de línea
        .replaceAll('\\pode_modules', '\\node_modules')
        .replaceAll(basePath, ''); // Reemplazar la ruta base del proyecto por una cadena vacía

    const logMessage = `${now.format('HH:mm:ss')} : ${formattedError}\n`;

    try {
        // Verificar si el directorio de logs existe, si no, crearlo
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        // Verificar si el archivo de registro ya existe
        if (fs.existsSync(logFilePath)) {
            // Si el archivo existe, agregar el mensaje de error al final
            fs.appendFileSync(logFilePath, logMessage);
        } else {
            // Si el archivo no existe, crearlo y agregar el mensaje de error
            fs.writeFileSync(logFilePath, logMessage);
        }

        console.log('Error registrado en el archivo de logs:', logFileName);
    } catch (err) {
        console.error('Error al registrar el error en el archivo de logs:', err);
    }
};

module.exports = logError
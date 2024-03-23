const logError = require('../utils/errorUtils');
const errorHandler = (err, req, res, next) => {
    console.log('ERROR HANDLER: ', err)
    //Mensaje del error
    const status = err.httpStatus || 500;
    const message = err.message || 'Ha ocurrido un error en el servidor';
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    const errorResponse = {
        status: 'error',
        code,
        message,
        error: err?.error?.message
    };
    //Se registra el error
    let dataToLog = {
        ...errorResponse,
        url: req.url,
        stack: err?.error?.stack || err?.stack,
        from: "middleware-errorHandler"
    }
    delete dataToLog.status;

    logError(dataToLog);
    //Se envía el error
    res.status(status).json(errorResponse);
};

module.exports = errorHandler;
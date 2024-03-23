const callcenterService = require('../services/callcenter');

const getCalls = async (req, res, next) => {
    try {
        const calls = await callcenterService.getCalls();
        res.status(200).send(calls);
    } catch (error) {
        next(error);
    }
}

const createCall = async (req, res, next) => {
    try {
        const idEmpleado = req.body?.idEmpleado || null;
        const tipoLlamada = req.body?.tipoLlamada || null;
        const fecha = req.body?.fecha || null;
        const nombre = req.body?.nombre || null;
        const domicilio = req.body?.domicilio || null;
        const telefono = req.body?.telefono || null;
        const reporte = req.body?.reporte || null;
        const acuerdo = req.body?.acuerdo || null;
        const productos = req.body?.productos || null;
        const seguimiento = req.body?.seguimiento || null;
        const observaciones = req.body?.observaciones || null;
        const motivo = req.body?.motivo || null;
        const correo = req.body?.correo || null;
        const asunto = req.body?.asunto || null;
        const compromiso = req.body?.compromiso || null;
        const nroSolicitud = req.body?.nroSolicitud || null;
        const nombreFallecido = req.body?.nombreFallecido || null;
        const lugarFallecimiento = req.body?.lugarFallecimiento || null;
        const fechaFallecimiento = req.body?.fechaFallecimiento || null;
        const idSucursal = req.body?.idSucursal || null;
        const fechaAgenda = req.body?.fechaAgenda || null;

        let call = {
            idEmpleado,
            idSucursal,
            tipoLlamada,
            fecha,
            nombre,
            domicilio,
            telefono,
            reporte,
            acuerdo,
            productos,
            seguimiento,
            observaciones,
            motivo,
            correo,
            asunto,
            compromiso,
            nroSolicitud,
            nombreFallecido,
            lugarFallecimiento,
            fechaFallecimiento,
            fechaAgenda
        }

        const createdCall = await callcenterService.createCall(call);
        res.status(200).send(createdCall);
    } catch (error) {
        next(error);
    }
}

const getCallsByEmployee = async (req, res, next) => {
    try {
        const { idEmpleado } = req.params;
        const calls = await callcenterService.getCallsByEmployee(idEmpleado);
        res.status(200).send(calls);
    } catch (error) {
        next(error);
    }
}

const getCallsByEmployeeAndType = async (req, res, next) => {
    const { idEmpleado, tipo } = req.body;
    try {
        const calls = await callcenterService.getCallsByEmployeeAndType(idEmpleado, tipo);
        res.status(200).send(calls);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getCalls,
    createCall,
    getCallsByEmployee,
    getCallsByEmployeeAndType
}

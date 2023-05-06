const { connection } = require('../controllers');

const getCalls = async (req, res) => {
    const response = await connection.query(`SELECT c.*, DATE(c.fecha) as fechaParsed, TIME(c.fecha) as horaParsed, e.nombre as nombreEmpleado, s.nombre as nombreSucursal
                        FROM callcenter c
                        LEFT JOIN empleados e ON e.id = c.idEmpleado
                        LEFT JOIN sucursales s ON s.id = c.idSucursal
                        `, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const createCall = async (req, res) => {
    // idEmpleado 	tipoLlamada 	fecha 	nombre 	domicilio 	telefono 	reporte 	acuerdo 	productos 	seguimiento 	observaciones 	motivo 	correo 	asunto 	compromiso 	nroSolicitud 	nombreFallecido 	lugarFallecimiento 	fechaFallecimiento 	
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

    //query with not null fields
    let query = `INSERT INTO callcenter (`;
    let values = `VALUES (`;
    if (idEmpleado) {
        query += `idEmpleado,`;
        values += `'${idEmpleado}',`;
    }
    if (idSucursal) {
        query += `idSucursal,`;
        values += `'${idSucursal}',`;
    }
    if (tipoLlamada) {
        query += `tipoLlamada,`;
        values += `'${tipoLlamada}',`;
    }
    if (fecha) {
        query += `fecha,`;
        values += `'${fecha}',`;
    }
    if (nombre) {
        query += `nombre,`;
        values += `'${nombre}',`;
    }
    if (domicilio) {
        query += `domicilio,`;
        values += `'${domicilio}',`;
    }
    if (telefono) {
        query += `telefono,`;
        values += `'${telefono}',`;
    }
    if (reporte) {
        query += `reporte,`;
        values += `'${reporte}',`;
    }
    if (acuerdo) {
        query += `acuerdo,`;
        values += `'${acuerdo}',`;
    }
    if (productos) {
        query += `productos,`;
        values += `'${productos}',`;
    }
    if (seguimiento) {
        query += `seguimiento,`;
        values += `'${seguimiento}',`;
    }
    if (observaciones) {
        query += `observaciones,`;
        values += `'${observaciones}',`;
    }
    if (motivo) {
        query += `motivo,`;
        values += `'${motivo}',`;
    }
    if (correo) {
        query += `correo,`;
        values += `'${correo}',`;
    }
    if (asunto) {
        query += `asunto,`;
        values += `'${asunto}',`;
    }
    if (compromiso) {
        query += `compromiso,`;
        values += `'${compromiso}',`;
    }
    if (nroSolicitud) {
        query += `nroSolicitud,`;
        values += `'${nroSolicitud}',`;
    }
    if (nombreFallecido) {
        query += `nombreFallecido,`;
        values += `'${nombreFallecido}',`;
    }
    if (lugarFallecimiento) {
        query += `lugarFallecimiento,`;
        values += `'${lugarFallecimiento}',`;
    }
    if (fechaFallecimiento) {
        query += `fechaFallecimiento,`;
        values += `'${fechaFallecimiento}',`;
    }
    if (fechaAgenda) {
        query += `fechaAgenda,`;
        values += `'${fechaAgenda}',`;
    }
    query = query.slice(0, -1);
    values = values.slice(0, -1);
    query += `) `;
    values += `)`;

    // create connection query
    const response = await connection.query(query + values, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Registro creado correctamente', success: true, insertedId: rows.insertId });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}

const getCallsByEmployee = async (req, res) => {
    const idEmpleado = req.params?.idEmpleado || null;
    const response = await connection.query(`SELECT * FROM callcenter WHERE idEmpleado = ${idEmpleado}`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows);
            } else {
                res.status(200).send({ message: 'No se encontraron llamadas', success: false });
            }
        }
    });
}

const getCallsByEmployeeAndType = async (req, res) => {
    const { idEmpleado, tipo } = req.body;
    const response = await connection.query(`SELECT * FROM callcenter WHERE idEmpleado = ${idEmpleado} AND tipoLlamada = '${tipo}'`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.length > 0) {
                res.status(200).send(rows);
            } else {
                res.status(200).send({ message: 'No se encontraron llamadas', success: false });
            }
        }
    });
}

module.exports = {
    getCalls,
    createCall,
    getCallsByEmployee,
    getCallsByEmployeeAndType
}

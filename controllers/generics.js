const genericsService = require('../services/generics')
const Dot = require('dot-object');
const dot = new Dot('_');

const updateContractNumber = async (req, res, next) => {
    const { id, contractNumber, tableName } = req.body;
    const data = { id, contractNumber, tableName };
    try {
        const updatedContract = await genericsService.updateContractNumber(data)
        res.status(200).json(updatedContract)
    } catch (error) {
        next(error);
    }
}

const genericDelete = async (req, res, next) => {
    try {
        const { table, id } = req.body;
        let field = req.body?.field;
        let keyField = field || 'id';
        let query = `DELETE FROM ${table} WHERE ${keyField} = ${id}`;
        const deleted = genericsService.genericQuery(query);
        res.status(200).json(deleted);
    } catch (error) {
        next(error);
    }
}

const genericGet = async (req, res, next) => {
    try {
        const { table } = req.body;
        let field = req.body?.field;
        let id = req.body?.id;
        let keyField = field || 'id';
        let query = '';
        if (id) {
            query = `SELECT * FROM ${table} WHERE ${keyField} = ${id}`;
        } else {
            query = `SELECT * FROM ${table}`;
        }
        const response = await genericsService.genericQuery(query);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

const genericUpdate = async (req, res, next) => {
    try {
        const { table, id, data } = req.body;
        let field = req.body?.field;
        let keyField = field || 'id';
        let query = '';
        let values = '';
        let keys = Object.keys(data);
        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                values += `${key} = '${data[key]}'`;
            } else {
                values += `${key} = '${data[key]}', `;
            }
        });
        query = `UPDATE ${table} SET ${values} WHERE ${keyField} = ${id}`;
        const response = await genericsService.genericQuery(query);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

const getLastId = async (req, res, next) => {
    try {
        let { tableName } = req.params;
        let query = `SELECT id FROM ${tableName} ORDER BY id DESC LIMIT 1`;
        const response = await genericsService.genericQuery(query);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

const importData = async (req, res, next) => {
    try {
        let { data, table, fields } = req.body
        let values = [];
        //fields have the fields of the table
        data?.forEach((row) => {
            let rowValues = [];
            fields?.forEach((field) => {
                rowValues.push(`'${row[field]}'`);
            });
            values.push(`(${rowValues.join(',')})`);
        });
        let fieldString = fields.join(',');
        const query = `INSERT INTO ${table} (${fieldString}) VALUES ${values.join(',')}`;
        const response = await genericsService.genericQuery(query);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

const getAllData = async (req, res, next) => {
    let { id } = req.params;
    try {
        console.time('getAllData');
        let result = await genericsService.getAllData(id);
        let item = result[0];
        let parsedItem = dot.object(item);

        if (item.contrato.tipo === "Programado") {
            delete parsedItem.ceremonia;
            delete parsedItem.fallecido;
        }
        if (item.contrato.tipo === "Inmediato") {
            delete parsedItem.beneficiario;
        }

        // Verificar si todas las propiedades de un objeto son null
        const isNullObject = obj => Object.values(obj).every(value => value === null);

        // Iterar sobre las propiedades del objeto y establecer el objeto completo como null si todas las propiedades son null
        Object.keys(parsedItem).forEach(key => {
            if (isNullObject(parsedItem[key])) {
                parsedItem[key] = null;
            }
        });

        console.timeEnd('getAllData');
        res.status(200).json(parsedItem);
    } catch (error) {
        next(error);
    }
}

const genericsController = {
    updateContractNumber,
    genericUpdate,
    genericGet,
    genericDelete,
    getLastId,
    importData,
    getAllData
}

module.exports = genericsController;

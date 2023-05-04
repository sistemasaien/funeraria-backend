const { connection } = require('../controllers');

const getLastId = async (req, res) => {
    let { tableName } = req.params;
    const response = await connection.query(`SELECT id FROM ${tableName} ORDER BY id DESC LIMIT 1`, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
}

const importData = async (req, res) => {
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
    await connection.query(query, function (err, rows) {
        if (err) {
            res.status(409).send(err);
        } else {
            if (rows?.affectedRows > 0) {
                res.status(200).send({ message: 'Datos con éxito', success: true });
            } else {
                res.status(200).send({ message: 'Ocurrió un error', success: false });
            }
        }
    });
}


module.exports = {
    importData,
    getLastId
}
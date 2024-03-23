const errors = require('./errors');

const main = async (schema, body) => {
    try {
        await schema.validateAsync(body);
    } catch (error) {
        console.log(error)
        let newErrors = error.details?.map((error) => {
            return {
                message: error.message,
                field: error.path[0],
            };
        });
        errors.schemaValidationError(newErrors);
    }
}

module.exports = main;

const errorMsg = {
    'any.required': 'El campo {#key} es requerido',
    'string.base': 'El valor de {#key} debe ser una cadena',
    'string.empty': 'El campo {#key} no debe estar vacío',
    'number.base': 'El valor de {#key} debe ser un número',
    'number.max': 'El archivo no debe exceder los 5 MB',
    'object.base': 'El valor de {#key} debe ser un objeto',
    'any.only': 'Solo se permiten fotos jpeg o png',
    'string.email': 'Debe proporcionar un correo electrónico válido.',
    'string.min': 'El campo {#key} debe tener al menos {#limit} caracteres',
    'string.max': 'El campo {#key} no debe exceder los {#limit} caracteres',
    'object.unknown': 'No se permiten campos adicionales en este objeto',
    'date.base': 'El valor de {#key} debe ser una fecha',
};

const errorMsgUsername = {
    'string.pattern.base':
        'El campo "{#key}" no debe contener espacios en blanco.',
};

const errorMsgPassword = {
    'string.pattern.base':
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
};

module.exports = {
    errorMsg,
    errorMsgUsername,
    errorMsgPassword,
};
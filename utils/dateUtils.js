const moment = require('moment');

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return formatDateYYMMDD(result);
}

function formatDateYYMMDD(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatDate(date, format) {
    let res = moment(date).format(format);
    if (res === 'Invalid date' || res === 'Fecha inválida') {
        return '';
    }
    return res;
}

function formatDDMMYYYYtoYYYYMMDD(date) {
    return date.split('/').reverse().join('-');
}

module.exports = {
    addDays,
    formatDate,
    formatDDMMYYYYtoYYYYMMDD
}
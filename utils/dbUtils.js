const getUpdateSentence = (table, body) => {
    let sentence = `UPDATE ${table} SET `;
    Object.keys(body).forEach((key, index) => {
        sentence += `${key} = '${body[key]}'`;
        if (index < Object.keys(body).length - 1) {
            sentence += ', ';
        }
    });
    return sentence;
}

const getInsertSentence = (table, body) => {
    let sentence = `INSERT INTO ${table} (`;
    Object.keys(body).forEach((key, index) => {
        sentence += `${key}`;
        if (index < Object.keys(body).length - 1) {
            sentence += ', ';
        }
    });
    sentence += ') VALUES (';
    Object.keys(body).forEach((key, index) => {
        sentence += `'${body[key]}'`;
        if (index < Object.keys(body).length - 1) {
            sentence += ', ';
        }
    });
    sentence += ')';
    return sentence;
}

module.exports = {
    getUpdateSentence,
    getInsertSentence
}
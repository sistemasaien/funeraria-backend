const path = require('path');
const sharp = require('sharp');

const uploadLogo = async (req, res, next) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No image uploaded' });
    } else {
        await sharp(file.buffer).png().toFile('./' + `/uploads/logo.png`)
        res.status(200).send({ message: 'Imagen subida satisfactoriamente', file: file });
    }
};

const getLogo = async (req, res, next) => {
    let basePath = __basedir;
    const filepath = path.join(basePath, 'uploads', 'logo.png');
    res.sendFile(filepath);
};

const logoController = {
    uploadLogo,
    getLogo
}

module.exports = logoController;
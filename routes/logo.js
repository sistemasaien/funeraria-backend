const logoController = require('../controllers/logo');
const router = require('express').Router();
const { uploadImage } = require('../utils/fileUtils');

router.post('/uploadLogo', uploadImage.single('logo'), logoController.uploadLogo);
router.get('/getLogo', logoController.getLogo);

module.exports = router;
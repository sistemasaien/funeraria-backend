const packsController = require('../controllers/packs');

const router = require('express').Router();

router.get('/packs', packsController.getPacks);
router.get('/getPack/:id', packsController.getPack);
router.post('/createPack', packsController.createPack);
router.post('/updatePack', packsController.updatePack);
router.post('/deletePack', packsController.deletePack);

module.exports = router;
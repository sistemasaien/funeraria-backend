const obituariesController = require('../controllers/obituaries');

const router = require('express').Router();

router.get('/obituaries', obituariesController.getObituaries);
router.get('/getObituary/:id', obituariesController.getObituary);
router.post('/createObituary', obituariesController.createObituary);
router.post('/updateObituary', obituariesController.updateObituary);
router.post('/deleteObituary', obituariesController.deleteObituary);

module.exports = router;
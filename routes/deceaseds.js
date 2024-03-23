const deceasedsController = require('../controllers/deceaseds');

const router = require('express').Router();

router.get('/deceaseds', deceasedsController.getDeceaseds);
router.get('/getDeceased/:id', deceasedsController.getDeceased);
router.post('/createDeceased', deceasedsController.createDeceased);
router.post('/updateDeceased', deceasedsController.updateDeceased);
router.post('/deleteDeceased', deceasedsController.deleteDeceased);

module.exports = router;
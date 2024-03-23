const waysController = require('../controllers/ways');

const router = require('express').Router();

router.get('/ways', waysController.getWays);
router.get('/getWay/:id', waysController.getWay);
router.post('/updateWay', waysController.updateWay);
router.post('/createWay', waysController.createWay);
router.post('/deleteWay', waysController.deleteWay);
router.get('/getCompleteWay/:id', waysController.getCompleteWay);

module.exports = router;
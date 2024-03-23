const cutsController = require('../controllers/cuts');
const router = require('express').Router();

router.get('/cuts', cutsController.getCuts);
router.get('/getCut/:id', cutsController.getCut);
router.post('/updateCutStatus', cutsController.updateCutStatus);
router.post('/createCut', cutsController.createCut);

module.exports = router;
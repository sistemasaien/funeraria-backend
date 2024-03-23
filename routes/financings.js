const financingsController = require('../controllers/financings');

const router = require('express').Router();

router.get('/financings', financingsController.getFinancings);
router.get('/completeFinancings', financingsController.getCompleteFinancings);
router.get('/getFinancing/:id', financingsController.getFinancing);
router.post('/createFinancing', financingsController.createFinancing);
router.post('/updateFinancing', financingsController.updateFinancing);
router.post('/deleteFinancing', financingsController.deleteFinancing);
router.post('/resetFinancing', financingsController.resetFinancing);
router.get('/getFinancingByContract/:id', financingsController.getFinancingByContract);

module.exports = router;
const breakdownCutsController = require('../controllers/breakdown_cuts');
const router = require('express').Router();

router.post('/createBreakdownCut', breakdownCutsController.createBreakdownCut);
router.post('/deleteBreakdownCut', breakdownCutsController.deleteBreakdownCut);
router.post('/updateBreakdownCut', breakdownCutsController.updateBreakdownCut);
router.get('/getBreakdownCut/:id', breakdownCutsController.getBreakdownCuts);
router.post('/updateBreakdownCutPayments', breakdownCutsController.updateBreakdownCutPayments)

module.exports = router;
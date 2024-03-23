const salesController = require('../controllers/sales');

const router = require('express').Router();

router.get('/sales', salesController.getSales);
router.get('/completeSales', salesController.getCompleteSales);
router.get('/getSale/:id', salesController.getSale);
router.post('/createSale', salesController.createSale);
router.post('/updateSale', salesController.updateSale);
router.post('/deleteSale', salesController.deleteSale);
router.post('/createCompleteSale', salesController.createCompleteSale);
router.post('/updateCompleteSale', salesController.updateCompleteSale);
router.post('/createCompleteSaleAfterInmediate', salesController.createCompleteSaleAfterInmediate);
router.post('/updateSalesWithWay', salesController.updateSalesWithWay);
router.get('/getCompleteSale/:id', salesController.getCompleteSale);

module.exports = router;
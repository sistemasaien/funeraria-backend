const express = require('express');
const router = express.Router();
const salesWaysController = require('../controllers/sales_ways');

router.post('/createSalesWays', salesWaysController.createSalesWays);
router.post('/insertMassiveSalesWays', salesWaysController.createManySalesWays);
router.post('/deleteSalesWays', salesWaysController.deleteSalesWayByWay);
router.get('/getLastOrder/:id', salesWaysController.getLastOrder);
router.post('/substractOrder', salesWaysController.substractOrder);
router.get('/getSalesWaysByWay/:id', salesWaysController.getSalesWaysByWay);

module.exports = router;
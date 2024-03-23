
const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/payments');

// Rutas
router.get('/payments', paymentsController.getPayments);
router.get('/getPayment/:id', paymentsController.getPayment);
router.post('/createPayment', paymentsController.createPayment);
router.post('/updatePayment', paymentsController.updatePayment);
router.post('/deletePayment', paymentsController.deletePayment);
router.get('/getPayments/:id', paymentsController.getPaymentsOfFinancing);
router.post('/createMassivePayment', paymentsController.createMassivePayment);
router.post('/updateCashPayment', paymentsController.updateCashPayment);
router.get('/getLastPendingPayment/:id', paymentsController.getLastPendingPayment);

module.exports = router;
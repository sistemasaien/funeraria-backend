const router = require('express').Router();
const pendingPaymentsController = require('../controllers/pending_payments');

router.post('/createPendingPayment', pendingPaymentsController.createPendingPayment);
router.post('/updatePendingPaymentStatus', pendingPaymentsController.updatePendingPaymentStatus);
router.post('/cleanPendingPayments', pendingPaymentsController.cleanPendingPayments);
router.get('/getPendingPayments', pendingPaymentsController.getPendingPayments);
router.post('/deletePendingPayment', pendingPaymentsController.deletePendingPayment);
router.post('/getPendingPaymentDetail', pendingPaymentsController.getPendingPaymentDetail)

module.exports = router;
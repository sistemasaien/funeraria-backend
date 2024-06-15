const payrollsController = require('../controllers/payrolls');

const router = require('express').Router();

router.post('/getPayrollDetailsByEmployeeSinceDate', payrollsController.getPayrollDetailsByEmployeeSinceDate);
router.get('/getPayrollDetailsById/:id', payrollsController.getPayrollDetailsById);
router.get('/getPayrollById/:id', payrollsController.getPayrollById);
router.post('/createPayroll', payrollsController.createPayroll);
router.post('/simulatePayroll', payrollsController.simulatePayroll);
router.get('/getPayrollsByEmployee/:id', payrollsController.getPayrollsByEmployee);
router.get('/generatePayrollPDF/:id', payrollsController.generatePayrollPDF);

module.exports = router;
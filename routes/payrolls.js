const payrollsController = require('../controllers/payrolls');

const router = require('express').Router();

router.post('/getPayrollDetailsByEmployeeSinceDate', payrollsController.getPayrollDetailsByEmployeeSinceDate);
router.get('/getPayrollDetailsById/:id', payrollsController.getPayrollDetailsById);
router.get('/getPayrollById/:id', payrollsController.getPayrollById);
router.post('/createPayroll', payrollsController.createPayroll);
router.get('/getPayrollsByEmployee/:id', payrollsController.getPayrollsByEmployee);

module.exports = router;
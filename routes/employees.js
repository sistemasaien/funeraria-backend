const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employees');

router.get('/employees', employeesController.getEmployees);
router.get('/getEmployee/:id', employeesController.getEmployee);
router.post('/updateEmployee', employeesController.updateEmployee);
router.post('/createEmployee', employeesController.createEmployee);
router.post('/deleteEmployee', employeesController.deleteEmployee);
router.post('/updateEmployeesWay', employeesController.updateEmployeesWay);
router.post('/deleteEmployeeWay', employeesController.deleteEmployeeWay);
router.get('/getEmployeeByUser/:id', employeesController.getEmployeeByUser);

module.exports = router;
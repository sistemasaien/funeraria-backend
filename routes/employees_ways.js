const employeesWaysController = require('../controllers/employees_ways');
const router = require('express').Router();

router.get('/getEmployeesWays', employeesWaysController.getEmployeesWays);
router.get('/getEmployeeWays/:id', employeesWaysController.getEmployeeWays);

module.exports = router;
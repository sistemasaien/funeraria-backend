const departmentsController = require('../controllers/departments');

const router = require('express').Router();

router.get('/departments', departmentsController.getDepartments);
router.get('/getDepartment/:id', departmentsController.getDepartment);
router.post('/createDepartment', departmentsController.createDepartment);
router.post('/updateDepartment', departmentsController.updateDepartment);
router.post('/deleteDepartment', departmentsController.deleteDepartment);

module.exports = router;
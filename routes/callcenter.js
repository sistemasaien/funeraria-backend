const callcenterController = require('../controllers/callcenter');
const router = require('express').Router();

router.get('/calls', callcenterController.getCalls);
router.post('/createCall', callcenterController.createCall);
router.get('/getCallsByEmployee/:idEmpleado', callcenterController.getCallsByEmployee);
router.post('/getCallsByEmployeeAndType', callcenterController.getCallsByEmployeeAndType);

module.exports = router;
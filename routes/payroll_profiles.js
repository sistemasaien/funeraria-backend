const payrollProfilesController = require('../controllers/payroll_profiles');

const router = require('express').Router();

router.get('/payrollProfiles', payrollProfilesController.getPayrollProfiles);
router.get('/getPayrollProfile/:id', payrollProfilesController.getPayrollProfile);
router.post('/createPayrollProfile', payrollProfilesController.createPayrollProfile);
router.post('/updatePayrollProfile', payrollProfilesController.updatePayrollProfile);
router.post('/deletePayrollProfile', payrollProfilesController.deletePayrollProfile);
router.post('/addPackToPayrollProfile', payrollProfilesController.addPackToPayrollProfile);
router.get('/getPayrollProfileAndPacks/:id', payrollProfilesController.getPayrollProfileAndPacks);
router.post('/deletePackOfPayrollProfile', payrollProfilesController.deletePackOfPayrollProfile);
router.post('/updatePackOfPayrollProfile', payrollProfilesController.updatePackOfPayrollProfile);

module.exports = router;
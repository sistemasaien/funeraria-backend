const beneficiariesController = require('../controllers/beneficiaries');

const router = require('express').Router();

router.get('/beneficiaries', beneficiariesController.getBeneficiaries);
router.get('/getBeneficiary/:id', beneficiariesController.getBeneficiary);
router.post('/createBeneficiary', beneficiariesController.createBeneficiary);
router.post('/updateBeneficiary', beneficiariesController.updateBeneficiary);
router.post('/deleteBeneficiary', beneficiariesController.deleteBeneficiary);

module.exports = router;
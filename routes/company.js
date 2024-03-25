const companyController = require('../controllers/company');
const router = require('express').Router();

router.get('/company', companyController.getCompanyData);
router.post('/updateCompanyData', companyController.updateCompanyData);
router.post('/createCompanyData', companyController.createCompanyData);

module.exports = router;
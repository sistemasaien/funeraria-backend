const companyController = require('../controllers/company');
const router = require('express').Router();

router.get('/company', companyController.getCompanyData);
router.post('/updateCompany', companyController.updateCompanyData);
router.post('/createCompany', companyController.createCompanyData);

module.exports = router;
const contractsController = require('../controllers/contracts');
const router = require('express').Router();

router.get('/contracts', contractsController.getContracts);
router.get('/getContract/:id', contractsController.getContract);
router.get('/getCompleteContract/:id', contractsController.getCompleteContract);
router.get('/getContractToPrint/:id', contractsController.getContractToPrint);
router.post('/updateContract', contractsController.updateContract);
router.post('/deleteContract', contractsController.deleteContract);
router.post('/createContract', contractsController.createContract);

module.exports = router;
const genericsController = require('../controllers/generics');
const router = require('express').Router();

router.post('/updateContractNumber', genericsController.updateContractNumber);
router.post('/genericDelete', genericsController.genericDelete);
router.post('/genericGet', genericsController.genericGet);
router.post('/genericUpdate', genericsController.genericUpdate);
router.get('/getLastId/:tableName', genericsController.getLastId);
router.post('/importData', genericsController.importData);
router.get('/getAllData/:id', genericsController.getAllData)

module.exports = router;
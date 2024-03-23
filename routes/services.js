const servicesController = require('../controllers/services');

const router = require('express').Router();

router.get('/services', servicesController.getServices);
router.get('/getService/:id', servicesController.getService);
router.post('/createService', servicesController.createService);
router.post('/updateService', servicesController.updateService);
router.post('/deleteService', servicesController.deleteService);

module.exports = router;
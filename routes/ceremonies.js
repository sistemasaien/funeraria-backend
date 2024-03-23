const ceremoniesController = require('../controllers/ceremonies');

const router = require('express').Router();

router.get('/ceremonies', ceremoniesController.getCeremonies);
router.get('/getCeremony/:id', ceremoniesController.getCeremony);
router.post('/createCeremony', ceremoniesController.createCeremony);
router.post('/updateCeremony', ceremoniesController.updateCeremony);
router.post('/deleteCeremony', ceremoniesController.deleteCeremony);

module.exports = router;
const profilesController = require('../controllers/profiles');
const router = require('express').Router();

router.get('/profiles', profilesController.getProfiles);
router.get('/getProfile/:id', profilesController.getProfile);
router.post('/createProfile', profilesController.createProfile);
router.post('/updateProfile', profilesController.updateProfile);
router.post('/deleteProfile', profilesController.deleteProfile);

module.exports = router;

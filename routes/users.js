const usersController = require('../controllers/users');

const router = require('express').Router();

router.get('/users', usersController.getUsers);
router.get('/getUser/:id', usersController.getUser);
router.post('/createUser', usersController.createUser);
router.post('/updateUser', usersController.updateUser);
router.post('/deleteUser', usersController.deleteUser);
router.post('/login', usersController.login);
router.get('/getUserPermissions/:username', usersController.getUserPermissions)

module.exports = router;
const permissionsController = require('../controllers/permissions');

const router = require('express').Router();

router.get('/permissions', permissionsController.getPermissions);
router.get('/getPermissionsByProfile/:profile', permissionsController.getPermissionsByProfile);
router.post('/deletePermission', permissionsController.deletePermission);
router.post('/createPermission', permissionsController.createPermission);
router.post('/updatePermission', permissionsController.updatePermission);
router.post('/deletePermissionsFromProfile', permissionsController.deletePermissionsFromProfile);
router.post('/createPermissions', permissionsController.createPermissions);
router.post('/updatePermissionsOfProfile', permissionsController.updatePermissionsOfProfile);

module.exports = router;
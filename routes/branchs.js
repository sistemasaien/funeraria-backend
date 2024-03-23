const branchsController = require('../controllers/branchs');

const router = require('express').Router();

router.get('/branchs', branchsController.getBranchs);
router.get('/getBranch/:id', branchsController.getBranch);
router.post('/createBranch', branchsController.createBranch);
router.post('/updateBranch', branchsController.updateBranch);
router.post('/deleteBranch', branchsController.deleteBranch);

module.exports = router;
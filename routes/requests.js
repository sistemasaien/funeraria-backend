const requestsController = require('../controllers/requests');

const router = require('express').Router();

router.get('/requests', requestsController.getRequests);
router.get('/getRequest/:id', requestsController.getRequest);
router.post('/createRequest', requestsController.createRequest);
router.post('/updateRequest', requestsController.updateRequest);
router.post('/deleteRequest', requestsController.deleteRequest);

module.exports = router;

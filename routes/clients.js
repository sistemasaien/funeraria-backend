const clientsController = require('../controllers/clients');

const router = require('express').Router();

router.get('/clients', clientsController.getClients);
router.get('/getClient/:id', clientsController.getClient);
router.post('/createClient', clientsController.createClient);
router.post('/updateClient', clientsController.updateClient);
router.post('/deleteClient', clientsController.deleteClient);
router.post('/getClientByNameAndBirthDate', clientsController.getClientByNameAndBirthDate);

module.exports = router;
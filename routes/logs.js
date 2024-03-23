const router = require('express').Router();
const logsController = require('../controllers/logs');

router.get('/logs', logsController.getLogs);

module.exports = router;
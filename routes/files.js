const express = require('express');
const router = express.Router();
const filesController = require('../controllers/files');

router.get('/files/database/list/:name', filesController.getListFiles);
router.get('/files/:bucket/download/:name', filesController.downloadFile);
router.post('/files/databases/delete/:name', filesController.deleteFile);
router.get('/files/databases/upload', filesController.uploadFile);
router.get('/files/databases/create/:name', filesController.createBucket);

module.exports = router;
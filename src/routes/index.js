const { Router } = require('express');
const router = Router();
const { deleteContract, deleteRequest, login, register, getRequests, getContracts, insertContract, insertRequest, updateContract, updateRequest, getContract, getRequest, deleteUser, updateUser, getUsers } = require('../controllers');

//User management
router.post('/login', login);
router.post('/register', register);
router.post('/updateUser', updateUser);
router.post('/deleteUser', deleteUser);
router.get('/users', getUsers);

//Contracts
router.get('/contracts', getContracts);
router.post('/insertContract', insertContract);
router.get('/getContract/:id', getContract);
router.post('/updateContract', updateContract);
router.post('/deleteContract', deleteContract);

//Requests
router.get('/requests', getRequests);
router.post('/insertRequest', insertRequest);
router.get('/getRequest/:id', getRequest);
router.post('/updateRequest', updateRequest);
router.post('/deleteRequest', deleteRequest);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // 追加

const auth = require('../lib/authenticate');

/* GET users listing. */
router.get('/', userController.getAllUsers);
router.post('/create', auth.isAuthenticated, userController.createUser)
router.get('/:id', auth.isAuthenticated, userController.getUserDetail)
router.post('/update/:id', auth.isAuthenticated, userController.updateUser)
router.delete('/delete/:id', auth.isAuthenticated, userController.deleteUser)

module.exports = router;

var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController'); // 追加

/* GET users listing. */
router.get('/', userController.getAllUsers);
router.post('/create', userController.createUser)
router.get('/:id', userController.getUserDetail)
router.post('/update/:id', userController.updateUser)
router.delete('/delete/:id', userController.deleteUser)

module.exports = router;

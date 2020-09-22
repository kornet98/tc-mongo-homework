const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/user', userController.createUser);
router.put('/user/:userId', userController.updateUser);
router.get('/user/:userId', userController.getUser);
router.delete('/user/:userId', userController.deleteUser);
router.get('/user/:userId/articles', userController.getUserArticles);


module.exports = router;
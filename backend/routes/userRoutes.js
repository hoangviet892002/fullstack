// routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Đăng ký người dùng
router.post('/register', UserController.register);
// Đăng nhập người dùng
router.post('/login', UserController.login);


module.exports = router;

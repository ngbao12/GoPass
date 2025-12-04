const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate } = require('../middleware');

// Protected routes - require authentication
router.use(authenticate);

router.get('/me', UserController.getProfile);
router.put('/me', UserController.updateProfile);
router.put('/me/change-password', UserController.changePassword);
router.put('/me/avatar', UserController.updateAvatar);

module.exports = router;

const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const auth = require('../middleware/auth');

// Volunteer profile routes
router.post('/profile', auth, volunteerController.updateProfile);
router.get('/profile', auth, volunteerController.getProfile);
router.post('/background-check', auth, volunteerController.uploadBackgroundCheck);
router.get('/stats', auth, volunteerController.getStats);

// Admin routes
router.patch('/:volunteerId/background-check', auth, volunteerController.updateBackgroundCheck);

module.exports = router; 
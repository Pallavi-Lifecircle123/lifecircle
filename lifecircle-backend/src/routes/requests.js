const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

// Elder routes
router.post('/', auth, requestController.createRequest);
router.get('/my-requests', auth, requestController.getElderRequests);

// Volunteer routes
router.get('/available', auth, requestController.getAvailableRequests);
router.post('/:requestId/assign', auth, requestController.assignVolunteer);
router.patch('/:requestId/status', auth, requestController.updateRequestStatus);
router.post('/:requestId/feedback', auth, requestController.addFeedback);

module.exports = router; 
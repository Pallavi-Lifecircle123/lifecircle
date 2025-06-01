const Request = require('../models/Request');
const User = require('../models/User');
const VolunteerProfile = require('../models/VolunteerProfile');

// Create a new request
const createRequest = async (req, res) => {
    try {
        const { taskType, description, location, scheduledTime, duration } = req.body;
        
        const request = new Request({
            elderId: req.user._id,
            taskType,
            description,
            location,
            scheduledTime,
            duration
        });

        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all requests for an elder
const getElderRequests = async (req, res) => {
    try {
        const requests = await Request.find({ elderId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all available requests for volunteers
const getAvailableRequests = async (req, res) => {
    try {
        const requests = await Request.find({ 
            status: 'pending',
            scheduledTime: { $gt: new Date() }
        }).sort({ scheduledTime: 1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assign a volunteer to a request
const assignVolunteer = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'Request is not available for assignment' });
        }

        // Check if volunteer has required skills
        const volunteerProfile = await VolunteerProfile.findOne({ userId: req.user._id });
        if (!volunteerProfile.skills.includes(request.taskType)) {
            return res.status(400).json({ error: 'You do not have the required skills for this task' });
        }

        request.assignedVolunteer = req.user._id;
        request.status = 'assigned';
        await request.save();

        res.json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update request status
const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, completionNotes } = req.body;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Verify user is either the elder or assigned volunteer
        if (request.elderId.toString() !== req.user._id.toString() && 
            request.assignedVolunteer?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this request' });
        }

        request.status = status;
        if (completionNotes) {
            request.completionNotes = completionNotes;
        }

        // If completed, update volunteer stats
        if (status === 'completed' && request.assignedVolunteer) {
            const volunteerProfile = await VolunteerProfile.findOne({ 
                userId: request.assignedVolunteer 
            });
            if (volunteerProfile) {
                volunteerProfile.totalHours += request.duration;
                volunteerProfile.completedRequests += 1;
                await volunteerProfile.save();
            }
        }

        await request.save();
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add feedback to a completed request
const addFeedback = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { rating, comment } = req.body;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.status !== 'completed') {
            return res.status(400).json({ error: 'Can only provide feedback for completed requests' });
        }

        // Only elder can provide feedback
        if (request.elderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Only the elder can provide feedback' });
        }

        request.feedback = { rating, comment };
        await request.save();

        // Update volunteer's average rating
        if (request.assignedVolunteer) {
            const volunteerProfile = await VolunteerProfile.findOne({ 
                userId: request.assignedVolunteer 
            });
            if (volunteerProfile) {
                const allRequests = await Request.find({
                    assignedVolunteer: request.assignedVolunteer,
                    'feedback.rating': { $exists: true }
                });
                const totalRating = allRequests.reduce((sum, req) => sum + req.feedback.rating, 0);
                volunteerProfile.rating = totalRating / allRequests.length;
                await volunteerProfile.save();
            }
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRequest,
    getElderRequests,
    getAvailableRequests,
    assignVolunteer,
    updateRequestStatus,
    addFeedback
}; 
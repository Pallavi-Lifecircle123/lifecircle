const VolunteerProfile = require('../models/VolunteerProfile');
const User = require('../models/User');

// Create or update volunteer profile
const updateProfile = async (req, res) => {
    try {
        const {
            skills,
            availability,
            certifications,
            preferredLocations,
            bio
        } = req.body;

        let profile = await VolunteerProfile.findOne({ userId: req.user._id });

        if (profile) {
            // Update existing profile
            Object.assign(profile, {
                skills,
                availability,
                certifications,
                preferredLocations,
                bio
            });
        } else {
            // Create new profile
            profile = new VolunteerProfile({
                userId: req.user._id,
                skills,
                availability,
                certifications,
                preferredLocations,
                bio
            });
        }

        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get volunteer profile
const getProfile = async (req, res) => {
    try {
        const profile = await VolunteerProfile.findOne({ userId: req.user._id });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Upload background check document
const uploadBackgroundCheck = async (req, res) => {
    try {
        const { documentUrl } = req.body;
        
        const profile = await VolunteerProfile.findOne({ userId: req.user._id });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        profile.backgroundCheck = {
            status: 'pending',
            documentUrl,
            verifiedAt: null
        };

        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get volunteer statistics
const getStats = async (req, res) => {
    try {
        const profile = await VolunteerProfile.findOne({ userId: req.user._id });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const stats = {
            totalHours: profile.totalHours,
            completedRequests: profile.completedRequests,
            rating: profile.rating,
            backgroundCheckStatus: profile.backgroundCheck.status
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Update background check status
const updateBackgroundCheck = async (req, res) => {
    try {
        const { volunteerId } = req.params;
        const { status } = req.body;

        // Verify admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const profile = await VolunteerProfile.findOne({ userId: volunteerId });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        profile.backgroundCheck.status = status;
        profile.backgroundCheck.verifiedAt = new Date();
        await profile.save();

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    updateProfile,
    getProfile,
    uploadBackgroundCheck,
    getStats,
    updateBackgroundCheck
}; 
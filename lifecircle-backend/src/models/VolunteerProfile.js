const mongoose = require('mongoose');

const volunteerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    skills: [{
        type: String,
        enum: ['companionship', 'tech_support', 'transportation', 'personal_care', 'medical_care', 'cooking', 'cleaning']
    }],
    availability: [{
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        },
        startTime: String,
        endTime: String
    }],
    certifications: [{
        name: String,
        issuingOrganization: String,
        issueDate: Date,
        expiryDate: Date,
        documentUrl: String
    }],
    backgroundCheck: {
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        documentUrl: String,
        verifiedAt: Date
    },
    totalHours: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    completedRequests: {
        type: Number,
        default: 0
    },
    preferredLocations: [String],
    bio: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
volunteerProfileSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('VolunteerProfile', volunteerProfileSchema); 
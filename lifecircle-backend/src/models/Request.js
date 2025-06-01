const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    elderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskType: {
        type: String,
        enum: ['companionship', 'tech_support', 'transportation', 'personal_care', 'medical_care', 'cooking', 'cleaning'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    assignedVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    completionNotes: String,
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    },
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
requestSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Request', requestSchema); 
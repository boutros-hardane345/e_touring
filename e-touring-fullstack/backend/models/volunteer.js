const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    applicationType: {
        type: String,
        enum: ['volunteer', 'internship', 'career'],
        required: true
    },
    availability: String,
    interests: [String],
    motivation: {
        type: String,
        required: true
    },
    source: String,
    resume: String,
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['individual', 'group', 'family', 'corporate'],
        required: true
    },
    category: {
        type: String,
        enum: ['hiking', 'camping', 'premium', 'custom'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Beginner', 'Challenging']
    },
    location: String,
    duration: String,
    priceIndividual: Number,
    priceGroup: Number,
    priceFamily: String,
    features: [String],
    included: [String],
    excluded: [String],
    image: String,
    popular: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Plan', PlanSchema);
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['hiking', 'cleanup', 'camping', 'workshop'],
        required: true
    },
    location: String,
    date: {
        type: Date,
        required: true
    },
    endDate: Date,
    time: String,
    price: Number,
    maxParticipants: Number,
    currentParticipants: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Beginner']
    },
    image: String,
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', EventSchema);
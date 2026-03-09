const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all events
router.get('/', async (req, res) => {
    try {
        const { category, status, difficulty } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (status) query.status = status;
        if (difficulty) query.difficulty = difficulty;
        
        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Create event (admin only)
router.post('/', [auth, admin], async (req, res) => {
    try {
        const newEvent = new Event({
            ...req.body,
            createdBy: req.user.id
        });
        
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update event (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        
        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Delete event (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        
        await event.deleteOne();
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
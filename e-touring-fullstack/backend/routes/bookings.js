const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create booking
router.post('/', auth, async (req, res) => {
    try {
        const { eventId, participants, specialRequests } = req.body;
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        
        if (event.currentParticipants + participants > event.maxParticipants) {
            return res.status(400).json({ msg: 'Not enough spots available' });
        }
        
        const booking = new Booking({
            user: req.user.id,
            event: eventId,
            participants,
            totalAmount: event.price * participants,
            specialRequests
        });
        
        await booking.save();
        
        // Update event participants
        event.currentParticipants += participants;
        await event.save();
        
        res.json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('event')
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }
        
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        // Update event participants
        const event = await Event.findById(booking.event);
        event.currentParticipants -= booking.participants;
        await event.save();
        
        res.json({ msg: 'Booking cancelled' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
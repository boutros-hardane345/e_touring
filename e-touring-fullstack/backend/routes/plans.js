const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all plans
router.get('/', async (req, res) => {
    try {
        const { type, difficulty } = req.query;
        let query = {};
        
        if (type) query.type = type;
        if (difficulty) query.difficulty = difficulty;
        
        const plans = await Plan.find(query).sort({ price: 1 });
        res.json(plans);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get single plan
router.get('/:id', async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ msg: 'Plan not found' });
        }
        res.json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Create plan (admin only)
router.post('/', [auth, admin], async (req, res) => {
    try {
        const newPlan = new Plan(req.body);
        const plan = await newPlan.save();
        res.json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update plan (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        let plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ msg: 'Plan not found' });
        }
        
        plan = await Plan.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        res.json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Delete plan (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ msg: 'Plan not found' });
        }
        
        await plan.deleteOne();
        res.json({ msg: 'Plan removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
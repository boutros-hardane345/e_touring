const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const { adminAuth } = require('../middleware/auth');

// Get all plans (public)
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const plans = await Plan.find(filter).sort({ price: 1 });
    res.json({ success: true, plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ success: false, message: 'Error fetching plans' });
  }
});

// Get single plan by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.json({ success: true, plan });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ success: false, message: 'Error fetching plan' });
  }
});

// Create new plan (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json({ success: true, message: 'Plan created successfully', plan });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ success: false, message: 'Error creating plan' });
  }
});

// Update plan (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.json({ success: true, message: 'Plan updated successfully', plan });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ success: false, message: 'Error updating plan' });
  }
});

// Delete plan (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ success: false, message: 'Error deleting plan' });
  }
});

module.exports = router;

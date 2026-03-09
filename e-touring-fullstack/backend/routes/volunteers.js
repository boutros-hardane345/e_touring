const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF and Word documents are allowed'));
    }
});

// Submit volunteer application
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const volunteerData = {
            ...req.body,
            resume: req.file ? `/uploads/${req.file.filename}` : null,
            interests: req.body.interests ? req.body.interests.split(',') : []
        };
        
        const volunteer = new Volunteer(volunteerData);
        await volunteer.save();
        
        res.json({ msg: 'Application submitted successfully', id: volunteer.id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get all applications (admin only)
router.get('/', [auth, admin], async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;
        
        const applications = await Volunteer.find(query).sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update application status (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Volunteer.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!application) {
            return res.status(404).json({ msg: 'Application not found' });
        }
        
        res.json(application);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
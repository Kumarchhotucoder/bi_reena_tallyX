const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect } = require('../middleware/authMiddleware');

// Get all companies for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const companies = await Company.find({ user: req.user._id });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching companies' });
    }
});

// Create a company with validation
router.post('/', protect, async (req, res) => {
    const { name, mailingName, address, state, country, pin, phone, email, gstinUin, fyFrom, booksFrom, securityPassword } = req.body;

    // Robust Validation
    if (!name) return res.status(400).json({ message: 'Company Name is mandatory' });
    if (!fyFrom || !booksFrom) return res.status(400).json({ message: 'Financial dates are mandatory' });

    try {
        // Check if company with same name already exists for this user
        const existingCompany = await Company.findOne({ name, user: req.user._id });
        if (existingCompany) {
            return res.status(400).json({ message: 'A company with this name already exists in your account' });
        }

        const company = new Company({
            name, mailingName, address, state, country, pin, phone, email, gstinUin,
            fyFrom, booksFrom, securityPassword,
            user: req.user._id
        });

        const newCompany = await company.save();
        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: newCompany
        });
    } catch (err) {
        res.status(400).json({ message: err.message || 'Error creating company' });
    }
});

module.exports = router;

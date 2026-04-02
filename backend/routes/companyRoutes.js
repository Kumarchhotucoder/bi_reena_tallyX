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
    const { name, mailingName, address, state, country, pin, phone, email, gstinUin, pan, fyFrom, booksFrom, securityPassword } = req.body;

    // Robust Validation with Regex for Security
    if (!name) return res.status(400).json({ message: 'Company Name is mandatory' });
    if (!fyFrom || !booksFrom) return res.status(400).json({ message: 'Financial dates are mandatory' });

    // GSTIN Validation (Optional but if provided must be valid)
    if (gstinUin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstinUin.toUpperCase())) {
        return res.status(400).json({ message: 'Invalid GSTIN format' });
    }

    // PAN Validation (Optional but if provided must be valid)
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase())) {
        return res.status(400).json({ message: 'Invalid PAN format' });
    }

    // PIN Code Validation
    if (pin && !/^[0-9]{6}$/.test(pin)) {
        return res.status(400).json({ message: 'Invalid PIN Code (must be 6 digits)' });
    }

    // Email Validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid Email format' });
    }

    try {
        // Check if company with same name already exists for this user
        const existingCompany = await Company.findOne({ name, user: req.user._id });
        if (existingCompany) {
            return res.status(400).json({ message: 'A company with this name already exists in your account' });
        }

        const company = new Company({
            name, mailingName, address, state, country, pin, phone, email, gstinUin, pan,
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

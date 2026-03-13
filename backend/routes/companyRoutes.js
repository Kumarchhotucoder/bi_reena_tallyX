const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect } = require('../middleware/authMiddleware');

// Get all companies
router.get('/', protect, async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a company
router.post('/', protect, async (req, res) => {
    const company = new Company(req.body);
    try {
        const newCompany = await company.save();
        res.status(201).json(newCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

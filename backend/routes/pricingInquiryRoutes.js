const express = require('express');
const router = express.Router();
const PricingInquiry = require('../models/PricingInquiry');

// @route   POST api/pricing-inquiries
// @desc    Create a new pricing inquiry
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { fullName, companyName, email, phone, interestedPlan } = req.body;

        const newInquiry = new PricingInquiry({
            fullName,
            companyName,
            email,
            phone,
            interestedPlan
        });

        const inquiry = await newInquiry.save();
        res.json(inquiry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/pricing-inquiries
// @desc    Get all pricing inquiries
// @access  Public
router.get('/', async (req, res) => {
    try {
        const inquiries = await PricingInquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

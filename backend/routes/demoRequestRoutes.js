const express = require('express');
const router = express.Router();
const DemoRequest = require('../models/DemoRequest');

// @route   POST api/demo-requests
// @desc    Create a new demo request
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { fullName, companySize, email, phone } = req.body;

        const newRequest = new DemoRequest({
            fullName,
            companySize,
            email,
            phone
        });

        const request = await newRequest.save();
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/demo-requests
// @desc    Get all demo requests
// @access  Public
router.get('/', async (req, res) => {
    try {
        const requests = await DemoRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

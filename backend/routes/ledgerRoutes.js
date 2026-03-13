const express = require('express');
const router = express.Router();
const Ledger = require('../models/Ledger');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const ledgers = await Ledger.find();
        res.json(ledgers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', protect, async (req, res) => {
    const ledger = new Ledger(req.body);
    try {
        const newLedger = await ledger.save();
        res.status(201).json(newLedger);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

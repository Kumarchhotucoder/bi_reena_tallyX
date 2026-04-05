const express = require('express');
const router = express.Router();
const Voucher = require('../models/Voucher');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const vouchers = await Voucher.find();
        res.json(vouchers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', protect, async (req, res) => {
    const voucher = new Voucher(req.body);
    try {
        const newVoucher = await voucher.save();
        res.status(201).json(newVoucher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const voucher = await Voucher.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!voucher) return res.status(404).json({ message: 'Voucher not found' });
        res.json(voucher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

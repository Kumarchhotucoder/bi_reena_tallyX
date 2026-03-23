const mongoose = require('mongoose');
const Voucher = require('../models/Voucher');
const Company = require('../models/Company');

// Create Voucher
exports.createVoucher = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const voucher = new Voucher({
      ...req.body,
      companyId: company._id
    });
    await voucher.save();
    res.status(201).json(voucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Vouchers for the authenticated user's company
exports.getVouchers = async (req, res) => {
  const { type } = req.query;
  try {
    const company = await Company.findOne({ user: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const filter = { companyId: company._id };
    if (type) filter.type = type;
    
    const vouchers = await Voucher.find(filter);
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

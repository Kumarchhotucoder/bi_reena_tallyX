const Ledger = require('../models/Ledger');
const Company = require('../models/Company');

// Create Ledger
exports.createLedger = async (req, res) => {
  try {
    // Find the company associated with the user
    const company = await Company.findOne({ user: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found for this user' });
    }

    // Check if a ledger with the same name already exists in this company
    const existingLedger = await Ledger.findOne({ name: req.body.name, companyId: company._id });
    if (existingLedger) {
      return res.status(400).json({ message: `Ledger with name "${req.body.name}" already exists.` });
    }

    const ledger = new Ledger({
      ...req.body,
      companyId: company._id
    });
    await ledger.save();
    res.status(201).json(ledger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Ledgers for the authenticated user's company
exports.getLedgers = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const ledgers = await Ledger.find({ companyId: company._id });
    res.status(200).json(ledgers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Stock = require('../models/Stock');
const Company = require('../models/Company');

// Create Stock Item
exports.createStock = async (req, res) => {
  try {
    // Find the company associated with the user
    const company = await Company.findOne({ user: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found for this user' });
    }

    // Check if a stock item with the same name already exists in this company
    const existingStock = await Stock.findOne({ name: req.body.name, companyId: company._id });
    if (existingStock) {
      return res.status(400).json({ message: `Stock item "${req.body.name}" already exists.` });
    }

    const stock = new Stock({
      ...req.body,
      companyId: company._id
    });
    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Stock Items for the authenticated user's company
exports.getStocks = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const stocks = await Stock.find({ companyId: company._id });
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

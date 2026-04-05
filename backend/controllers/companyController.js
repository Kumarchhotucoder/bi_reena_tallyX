const Company = require('../models/Company');

// Create Company
exports.createCompany = async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      user: req.user._id
    };
    const company = new Company(companyData);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Companies for the authenticated user
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ user: req.user._id });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

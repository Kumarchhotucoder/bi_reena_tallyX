const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    state: String,
    pin: String,
    fyFrom: Date,
    booksFrom: Date,
    gstin: String,
    pan: String,
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);

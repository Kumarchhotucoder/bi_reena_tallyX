const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    mailingName: String,
    address: String,
    state: String,
    country: { type: String, default: 'India' },
    pin: String,
    phone: String,
    email: String,
    gstinUin: String,
    pan: String,
    fyFrom: { type: Date, default: '2025-04-01' },
    booksFrom: { type: Date, default: '2025-04-01' },
    securityPassword: { type: String }, // In real app, this should be hashed
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);

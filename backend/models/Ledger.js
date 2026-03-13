const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    group: { type: String, required: true },
    maintainBillByBill: { type: Boolean, default: false },
    address: String,
    state: String,
    taxRegistration: String,
    gstin: String,
    openingBalance: { type: Number, default: 0 },
    openingBalanceType: { type: String, enum: ['Dr', 'Cr'] },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
}, { timestamps: true });

module.exports = mongoose.model('Ledger', ledgerSchema);

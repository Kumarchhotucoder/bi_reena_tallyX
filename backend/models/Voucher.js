const mongoose = require('mongoose');

const voucherItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    hsn: String,
    qty: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    amount: { type: Number, default: 0 }
});

const voucherEntrySchema = new mongoose.Schema({
    type: { type: String, enum: ['Dr', 'Cr'] },
    ledger: { type: mongoose.Schema.Types.ObjectId, ref: 'Ledger' },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 }
});

const voucherSchema = new mongoose.Schema({
    type: { type: String, enum: ['SALES', 'PURCHASE', 'PAYMENT', 'RECEIPT', 'CONTRA', 'JOURNAL'], required: true },
    voucherNo: String,
    date: { type: Date, default: Date.now },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Ledger' }, // For Sales/Purchase
    ledger: { type: mongoose.Schema.Types.ObjectId, ref: 'Ledger' }, // For Sales/Purchase
    placeOfSupply: String, // For Sales
    supInvNo: String, // For Purchase
    items: [voucherItemSchema],
    entries: [voucherEntrySchema], // For Journal/Payment/Receipt/Contra
    narration: String,
    totalAmount: { type: Number, default: 0 },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
}, { timestamps: true });

module.exports = mongoose.model('Voucher', voucherSchema);

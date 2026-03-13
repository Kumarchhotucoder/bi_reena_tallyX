const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    group: String,
    uom: String,
    hsn: String,
    taxability: String,
    costingMethod: String,
    maintainBatches: { type: Boolean, default: false },
    openingQty: { type: Number, default: 0 },
    openingRate: { type: Number, default: 0 },
    openingValue: { type: Number, default: 0 },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);

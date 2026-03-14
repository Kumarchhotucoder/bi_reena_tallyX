const mongoose = require('mongoose');

const PricingInquirySchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    interestedPlan: {
        type: String,
        default: 'Not Specified'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PricingInquiry', PricingInquirySchema);

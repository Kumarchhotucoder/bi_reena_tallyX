const mongoose = require('mongoose');

const DemoRequestSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    companySize: {
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DemoRequest', DemoRequestSchema);

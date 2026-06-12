require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bireena_tallyx';

// Production CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Database connection logic for Serverless environments (cached connection)
let cachedDb = null;
const connectDB = async () => {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }
    console.log('Connecting to database...');
    cachedDb = await mongoose.connect(MONGO_URI);
    console.log('Database connected');
    return cachedDb;
};

// Middleware to guarantee DB is connected before requests are handled
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection error in middleware:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Routes
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/ledgers', require('./routes/ledgerRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));
app.use('/api/pricing-inquiries', require('./routes/pricingInquiryRoutes'));
app.use('/api/demo-requests', require('./routes/demoRequestRoutes'));
app.use('/api', require('./routes/userRoutes'));

app.get('/', (req, res) => res.send('API Running'));

// Start server locally (non-serverless environments)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;


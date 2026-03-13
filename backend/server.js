require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/ledgers', require('./routes/ledgerRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));
app.use('/api', require('./routes/userRoutes'));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bireena_tallyx';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

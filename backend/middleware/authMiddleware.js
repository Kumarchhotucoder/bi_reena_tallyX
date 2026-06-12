const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const secret = process.env.JWT_SECRET || 'bireena_tallyx_secret_key';
            const decoded = jwt.verify(token, secret);

            if (decoded.id === '000000000000000000000001') {
                req.user = {
                    _id: '000000000000000000000001',
                    name: 'Demo Admin User',
                    email: process.env.DEFAULT_ADMIN_EMAIL || 'chhotu6826@gmail.com',
                    role: 'admin',
                    companyName: 'Bireena TallyX'
                };
            } else {
                // Get user from the token (exclude password)
                req.user = await User.findById(decoded.id).select('-password');
            }

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// Role hierarchy definition
const roles = ['staff', 'ca', 'admin', 'superadmin'];

const authorize = (...requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ success: false, message: 'User role not defined' });
        }

        const userRoleIndex = roles.indexOf(req.user.role);
        const requiredRoleIndices = requiredRoles.map(role => roles.indexOf(role));
        const minRequiredIndex = Math.min(...requiredRoleIndices);

        if (userRoleIndex >= minRequiredIndex) {
            next();
        } else {
            return res.status(403).json({ 
                success: false, 
                message: `User role ${req.user.role} is not authorized to access this route` 
            });
        }
    };
};

module.exports = { protect, authorize };

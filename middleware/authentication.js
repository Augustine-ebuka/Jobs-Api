const User = require('../models/User')
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');



const auth = async (req, res, next) => { 
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid')
    }

    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId: payload.userId, name: payload.name}
        next();
    }
    catch (err) {
        throw new UnauthenticatedError('Invalid Credentials, unable to verify Token')
    }
}


module.exports = auth;
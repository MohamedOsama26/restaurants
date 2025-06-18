const jwt = require('jsonwebtoken');

// Middleware 1: Just authenticates token and attaches req.user
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token invalid or expired' });
    }
};

// Middleware 2: Assumes req.user is already set (use after `authenticate`)
const checkType = (...allowedTypes) => {
    return (req, res, next) => {
        const { user } = req;
        if (!user || !allowedTypes.includes(user.userType)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

// Middleware 3: Combined authenticate + checkType
const authorize = (...allowedTypes) => {
    return (req, res, next) => {


        const authHeader = req.headers.authorization;


        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            console.log('**************************');
            console.log(allowedTypes);
            console.log(decoded);
            console.log(!allowedTypes.includes(decoded.userType));
            console.log('**************************');

            if (!allowedTypes.includes(decoded.userType) && allowedTypes.length>0) {
                return res.status(403).json({ message: 'Access denied' });
            }
            console.log('next');
            next();
        } catch (err) {
            console.error(err.message);
            return res.status(401).json({ msg: 'Token invalid or expired' });
        }
    };
};


module.exports = {
    authenticate,
    checkType,
    authorize
};
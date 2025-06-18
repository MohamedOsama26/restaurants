const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // you can now access req.user.id
        console.log('--------');
        console.log(req.user);
        console.log('--------');
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token invalid or expired' });
    }
};

const resetAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({msg: 'No token provided'});

    const token = authHeader.split(' ')[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_RESET_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Invalid or expired reset token' });
    }
};


module.exports = { auth, resetAuth };
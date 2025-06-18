const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    console.log('user:', user);
    return jwt.sign(
        {
            id: user.id,
            userType: user.userType,
        }, process.env.JWT_SECRET,
        {expiresIn: '15m'});
}

const generateRefreshToken = (user) => {
    console.log('user:', user);
    return jwt.sign({
        id: user.id,
        userType: user.userType,
    }, process.env.JWT_REFRESH_SECRET,
        {expiresIn: '7d'});
}
module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
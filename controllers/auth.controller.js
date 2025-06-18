const User = require('../models/User');
const OtpToken = require('../models/OtpToken');
const bcrypt = require('bcryptjs');
const {validateAuthField, isValidMobile, isValidEmail, isEmailRegistered, isMobileRegistered} = require("../utils/validators");
const {generateAccessToken, generateRefreshToken} = require("../helpers/token");
const jwt = require("jsonwebtoken");
const {generateOTP, getOtpExpiry} = require("../helpers/otp");
const {sendOtpEmail} = require("../utils/mailer");
const awesomePhoneNumber = require("awesome-phonenumber");
const { loginWithGoogle } = require('../services/googleAuth');

//POST /api/auth/google-login
const googleLogin = async (req, res) => {
    try {
        const {idToken} = req.body;
        const result = await loginWithGoogle(idToken);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({msg: 'Google login failed', error: error.message,})
    }
}

//POST /api/auth/login
const login = async (req, res) => {
    try {
        const {emailOrPhone, password,} = req.body;

        const user = await validateAuthField(emailOrPhone);

        if (!user.isValid) {
            return res.status(401).json({msg: 'Invalid email or mobile format'});
        } else if (user.user === 'Invalid email or mobile format') {
            return res.status(401).json({msg: 'Invalid email or mobile format'});
        } else if (user.user === 'This account is not registered') {
            return res.status(401).json({msg: 'This account is not registered'});
        }

        const isMatch = await bcrypt.compare(password, user.user.password);
        if (!isMatch) {
            return res.status(400).json({msg: 'Invalid credentials'});
        }

        const accessToken = generateAccessToken(user.user);
        const refreshToken = generateRefreshToken(user.user);

        await user.user.updateOne(
        {
            $push:{
                refreshTokens: {
                    userId: user.user.id,
                    token: refreshToken,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
            }
        });

        return res.status(200).json({
            msg: 'Login successful',
            user: {
                id: user.user.id,
                name: user.user.name,
            },
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            msg: 'Failed to login',
            error: error.message,
        });
    }
}

//POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, phone, password, addresses, image, dob } = req.body;

        if (!isValidEmail(email)) {
            return res.status(400).json({ msg: 'Invalid email format' });
        }
        if (!isValidMobile(phone)) {
            return res.status(400).json({ msg: 'Invalid mobile format' });
        }

        const existingUserByMail = await isEmailRegistered(email);//validateAuthField(email);
        const existingUserByPhone = await isMobileRegistered(phone);//validateAuthField(phone);

        if (existingUserByMail || existingUserByPhone) {
            return res.status(400).json({ msg: 'Email or mobile already exists' });
        }

        const ph = awesomePhoneNumber.parsePhoneNumber(phone, { regionCode: 'EG' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone: ph.number.e164,
            addresses,
            image,
            dob,
            refreshTokens: [],
        });

        const accessToken = generateAccessToken({ id: newUser.id }); // Placeholder, real value after creation
        const refreshToken = generateRefreshToken({ id: newUser.id });


        newUser.refreshTokens.push({
            userId: newUser._id,
            token: refreshToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        await newUser.save();

        return res.status(201).json({
            msg: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name
            },
            accessToken,
            refreshToken,
        });

    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            if (error.keyPattern?.email) {
                return res.status(400).json({ msg: 'This email already exists' });
            }
            if (error.keyPattern?.phone) {
                return res.status(400).json({ msg: 'This phone number already exists' });
            }
        }
        return res.status(500).json({
            msg: 'Server Error',
            error: error.message,
        });
    }
};

//POST /api/auth/refresh
const refresh = async (req, res) => {

    const authHeader = req.headers.authorization;


    const refreshToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    console.log(refreshToken);
    if (!refreshToken) return res.status(401).json({ msg: 'No refresh token provided' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // console.log(user.refreshTokens);
        //Look for matching token in DB
        const storedToken = user.refreshTokens.find(token => token.token === refreshToken);
        // console.log(storedToken);
        if(!storedToken) return res.status(400).json({ msg: 'Refresh token not recognized' });

        console.log(Date.now());
        // Check if token is expired
        if (Date.now() > storedToken.expiresAt) {
            return res.status(400).json({ msg: 'Refresh token expired' });
        }

        const newAccessToken = generateAccessToken(user);
        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error(error.message);
        return res.status(403).json({ msg: 'Token verification failed' });
    }
};

//POST /api/auth/request-otp
const requestOtp = async (req, res) => {
    const { email } = req.body;

    const  user = await User.findOne({email});
    if(!user){
        return res.status(404).json({msg: 'User not found'});
    }

    console.log(user);

    const otp = generateOTP();
    const expiresAt = getOtpExpiry();

    await OtpToken.create({userId:user.id,otp,expiresAt});
    await sendOtpEmail(email,otp);

    return res.status(200).json({msg: 'OTP sent to email'});
};

//POST /api/auth/logout
const logout = async (req, res) => {

    const authHeader = req.headers.authorization;
    const refreshToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    console.log(refreshToken);

    if (!refreshToken) {
        return res.status(400).json({ msg: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Remove current refresh token only
        user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
        await user.save();

        return res.status(200).json({ msg: 'Logged out successfully from current device' });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ msg: 'Invalid or expired refresh token' });
    }
}

//POST /api/auth/verify-login-otp
const verifyLoginOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({email});
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    const record = await OtpToken.findOne({userId: user.id,otp});
    if(!record || record.expiresAt < Date.now()){
        return res.status(400).json({msg: 'Invalid or expired OTP'});
    }

    await OtpToken.deleteMany({userId:user.id});

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await user.updateOne({refreshToken});

    return res.status(200).json({
        msg: 'Login successful with OTP',
        user:{
            id: user.id,
            name: user.name,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
}

//POST /api/auth/find-email
const findEmail = async (req, res) => {
    const { emailOrPhone } = req.body;

    const user = await validateAuthField(emailOrPhone);

    if(user.user === 'Invalid email or mobile format'){
        return res.status(400).json({msg: 'Invalid email or mobile format'});
    }else if(user.user === 'This account is not registered'){
        return res.status(404).json({msg: 'This email is not registered'});
    }


    return res.status(200).json({msg: `Email found: ${user.user.email}`});
}

//POST /api/auth/verify-reset-otp
const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    console.log(email,otp);
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const record = await OtpToken.findOne({userId: user.id, otp});
    if(!record || record.expiresAt < Date.now()){
        return res.status(400).json({msg: 'Invalid or expired OTP'});
    }

    await OtpToken.deleteMany({userId:user.id});

    // 🔐 Issue short-lived reset token (e.g., 5-10 min)
    const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_RESET_SECRET,
        { expiresIn: '10m' }
    );

    return res.status(200).json({msg: 'OTP verified', resetToken});
}

//POST /api/auth/reset-password
const resetPassword = async (req, res) => {
    const {newPassword, verifyNewPassword} = req.body;

    if (newPassword !== verifyNewPassword) {
        return res.status(400).json({msg: 'Passwords do not match'});
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({msg: 'User not found'});
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({msg: 'Password reset successfully'});
};


module.exports = {
    login,
    register,
    refresh,
    requestOtp,
    logout,
    verifyLoginOtp,
    resetPassword,
    findEmail,
    verifyResetOtp,
    googleLogin,
}
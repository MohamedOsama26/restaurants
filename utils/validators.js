const validator = require('validator');
const awesomePhoneNumber = require('awesome-phonenumber');
const User = require("../models/User");

const isValidEmail = (email) => {
    return typeof email === 'string' && validator.isEmail(email.trim());
};

const isValidMobile = (mobile) => {
    // Is Egyptian mobile number
    const ph = awesomePhoneNumber.parsePhoneNumber(mobile,{regionCode:'EG'});
    return ph.typeIsMobile;
}

const isEmailRegistered = async  (email) => {
    try {
        return await User.findOne({email}).select('+password');
    }catch (error) {
        console.error('Error checking email registration:', error);
        return false;
    }
}

const isMobileRegistered = async (mobile) => {
    try {
        const ph = awesomePhoneNumber.parsePhoneNumber(mobile,{regionCode:'EG'});
        const number = ph.number.e164;
        return await User.findOne({phone:number}).select('+password');
    } catch (error) {
        console.error('Error checking mobile registration:', error);
        return false;
    }
}

const validateAuthField = async (input) => {
    input = input.trim();

    let isEmail = false;
    let isPhone = false;
    let isValid;
    let user;

    if (isValidMobile(input)) {
        isPhone = true;
        isValid = true;
        console.log(`-input:${input}, isValid:${isValid}, isEmail:${isEmail}, isPhone:${isPhone}`);
        user = await isMobileRegistered(input);
        console.log(`-user:${user}`);
    }
    // check if input is mobile
    else if(isValidEmail(input)) {
        isEmail = true;
        isValid = true;
        user = await isEmailRegistered(input);
    }
    else{
        isValid = false;
    }

    return {
        input,
        isEmail,
        isPhone,
        isValid,
        user: !isValid ? 'Invalid email or mobile format' :
            user!=null ? user : 'This account is not registered',
    };
}

module.exports = {
    isValidEmail,
    isValidMobile,
    isEmailRegistered,
    isMobileRegistered,
    validateAuthField,
}
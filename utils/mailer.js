const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'localhost', // or another email provider
    port: 1025,
    secure: false,
    auth: null,
});

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP for LabKey',
        html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
        text: `Your OTP is ${otp}`,
    };
    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendOtpEmail,
}
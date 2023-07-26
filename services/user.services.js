const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../module/user');


const jwtSecret = process.env.SECRET_KEY;

const generateOTP = () => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Login OTP',
        text: `Your OTP for login is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

const registerUser = async (email, password, fname, lname) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        email, password: hashedPassword, fname, lname
    });

    try {
        await user.save();
        return true;
    } catch (error) {
        console.error('Error registering user:', error);
        return false;
    }
};

const loginUser = async (email, otp) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: 'User not found' };
    }

    if (user.otp && user.otpExpiration && otp === user.otp && new Date() <= user.otpExpiration) {
        const token = jwt.sign({ email: user.email }, jwtSecret, { expiresIn: '1h' });
        return { success: true, user: user.toObject(), token };
    } else {
        return { success: false, message: 'Invalid OTP' };
    }
};


module.exports = {
    generateOTP,
    registerUser,
    sendOTPEmail,
    loginUser,
};

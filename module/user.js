const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otpExpiration: { type: Date, default: null },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

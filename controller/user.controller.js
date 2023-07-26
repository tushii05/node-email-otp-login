const express = require('express');
const router = express.Router();
const authService = require('../services/user.services');
const User = require('../module/user');


router.post('/register', async (req, res) => {
  const { email, password, fname, lname } = req.body;
  const result = await authService.registerUser(email, password, fname, lname);

  if (result) {
    res.status(201).json({ message: 'User registered successfully' });
  } else {
    res.status(500).json({ message: 'Failed to register user' });
  }
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const otp = authService.generateOTP();

  const result = await authService.sendOTPEmail(email, otp);

  if (result) {
    const expirationTime = new Date(Date.now() + 600000);
    await User.findOneAndUpdate({ email }, { otp, otpExpiration: expirationTime });

    res.status(200).json({ message: 'OTP sent successfully. Please check your email.', otp });
  } else {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

router.post('/login/otp', async (req, res) => {
  const { email, otp } = req.body;

  const result = await authService.loginUser(email, otp);

  if (result.success) {
    res.status(200).json({ user: result.user, token: result.token });
  } else {
    res.status(401).json({ message: result.message });
  }
});

module.exports = router;

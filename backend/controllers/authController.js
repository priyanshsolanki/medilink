// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmail');

exports.register = async (req, res) => {
  const { name, gender, dob, email, password, role } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  user = new User({
    name,
    gender,
    dob,
    email,
    password: await bcrypt.hash(password, 10),
    role
  });
  await user.save();

  const token = generateToken(user);
  res.json({
    token,
    user: {
      id: user._id,
      name,
      gender,
      dob,
      email,
      role
    }
  });
};

// -------- Login: Sends OTP, no login yet --------
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  // Generate OTP and stateless JWT for verification
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpToken = jwt.sign(
    { userId: user._id, otp, purpose: 'login' },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );

  await sendEmail(user.email, 'Your Login OTP', `Your OTP is: ${otp}`);

  res.json({ otpSent: true, otpToken });
};

// -------- Verify Login OTP --------
exports.verifyLoginOtp = async (req, res) => {
  const { otpToken, otp } = req.body;

  try {
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.purpose !== 'login')
      return res.status(400).json({ msg: 'Invalid token purpose' });

    if (decoded.otp !== otp)
      return res.status(400).json({ msg: 'Invalid OTP' });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        gender: user.gender,
        dob: user.dob,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid or expired OTP token' });
  }
};

// -------- Forgot Password: Sends OTP, stateless --------
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'No user with that email' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpToken = jwt.sign(
    { userId: user._id, otp, purpose: 'reset' },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );

  await sendEmail(user.email, 'Your Password Reset OTP', `Your OTP is: ${otp}`);
  res.json({ msg: 'OTP sent to your email', otpToken });
};

// -------- Reset Password: Verify OTP & Update --------
exports.resetPassword = async (req, res) => {
  const { otpToken, otp, newPassword } = req.body;

  try {
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.purpose !== 'reset')
      return res.status(400).json({ msg: 'Invalid token purpose' });

    if (decoded.otp !== otp)
      return res.status(400).json({ msg: 'Invalid OTP' });

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: 'Password has been reset successfully' });
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid or expired OTP token' });
  }
};
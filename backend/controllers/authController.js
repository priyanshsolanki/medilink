// controllers/authController.js
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/sendEmail');

exports.register = async (req, res) => {
  const { name, gender, dob, email, password, role,...optionalFields } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: 'User already exists' });
  const verificationToken = crypto.randomBytes(32).toString('hex');


  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${email}`;

  await sendEmail(
    email,
    'Verify Your Email',
    `<p>Hi ${name},</p><p>Please click the link below to verify your email:</p><a href="${verificationUrl}">Verify Email</a>`
  );

  user = new User({
    name,
    gender,
    dob,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    verificationToken,
    ...optionalFields
  });
  await user.save();

  res.json({
    user: {
      id: user._id,
      name,
      gender,
      dob,
      email,
      role,
      ...optionalFields
    }
  });
};

exports.verifyEmail = async (req, res) => {
  const { token, email } = req.query;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'User not found' });

  if (user.verificationToken !== token) {
    return res.status(400).json({ msg: 'Invalid or expired token' });
  }

  user.isVerified = true;
  user.verificationToken = undefined; // remove the token
  await user.save();

  res.json({ msg: 'Email verified successfully' });
};

// -------- Login: Sends OTP, no login yet --------
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
  
  // Check if the email is verified
  if (!user.isVerified) {
    return res.status(403).json({ msg: 'Email not verified. Please check your inbox to verify your account.' });
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
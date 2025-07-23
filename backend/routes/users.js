// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const User = require('../models/User');

router.get('/', auth, role('admin'), async (req, res) => {
  const users = await User.find().select('-password -mfaSecret');
  res.json(users);
});

router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User
      .find({ role: 'doctor' })
      .select('name specialty rating experience location image fee')
      .lean();
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});
module.exports = router;

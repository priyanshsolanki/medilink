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

module.exports = router;

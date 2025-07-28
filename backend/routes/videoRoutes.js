const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getVideoToken } = require('../controllers/videoController');

router.get('/:appointmentId/token', auth, getVideoToken);

module.exports = router;

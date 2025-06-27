// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/sendEmail');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // 1. Create temp password
          const tempPassword = crypto.randomBytes(8).toString('hex'); // 16 chars
          const hashedPassword = await bcrypt.hash(tempPassword, 10);

          // 2. Create user
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            gender: 'other',
            dob: new Date('1970-01-01'),
            password: hashedPassword,
            role: 'patient'
          });
          await user.save();

          // 3. Email temp password
          await sendEmail(
            user.email,
            'Welcome to MediLink! Temporary Password',
            `Hi ${user.name},\n\nWelcome! Your temporary password is: ${tempPassword}\n\nYou can use this password to log in directly and then set a new password from your profile.`
          );
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id || user._id); // Ensure it's a valid value
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

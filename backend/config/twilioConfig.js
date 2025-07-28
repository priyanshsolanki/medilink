const twilio = require('twilio');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const { AccessToken } = twilio.jwt;
const { VideoGrant } = AccessToken;

function generateAccessToken(identity, room) {
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity, ttl: 3600 } // 1-hour TTL
  );
  console.log(token);
  token.addGrant(new VideoGrant({ room }));
  return token.toJwt();
}

module.exports = {
  twilioClient,
  generateAccessToken,
};

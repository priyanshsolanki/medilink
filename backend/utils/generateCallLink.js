const jwt = require('jsonwebtoken');

// Utility: generate secure call link JWT token
exports.generateCallLinkToken = (appointment, user) => {
    const token = jwt.sign(
        {
            appointmentId: appointment._id,
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    return `http://localhost:8081/room/room_${appointment._id}?token=${token}`;
};
const Notification = require('../models/Notification');
const twilio = require('twilio');
const nodemailer = require('nodemailer');

// Validate required environment variables
const requiredEnvVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'EMAIL_SERVICE',
    'EMAIL_USER',
    'EMAIL_PASS'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

// Configure email transporter with secure defaults
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false,
    },
});

// Verify transporter connection
transporter.verify((error) => {
    if (error) {
        console.error('Error with mail transporter:', error);
    } else {
        console.log('Mail transporter is ready');
    }
});

class NotificationService {
    static async scheduleNotification(userId, relatedId, type, message, deliveryMethod, scheduledTime) {
        try {
            const notification = new Notification({
                userId,
                relatedId,
                type,
                message,
                deliveryMethod,
                scheduledTime,
            });
            await notification.save();
            return notification;
        } catch (error) {
            console.error('Error scheduling notification:', error);
            throw error;
        }
    }

    static async sendNotification(notification) {
        try {
            let result;

            if (notification.deliveryMethod === 'sms') {
                if (!twilioClient) {
                    throw new Error('Twilio client not initialized');
                }
                result = await twilioClient.messages.create({
                    body: notification.message,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: process.env.TEST_PHONE_NUMBER || '+1234567890',
                });
            } else if (notification.deliveryMethod === 'email') {
                result = await transporter.sendMail({
                    from: `"MediLink" <${process.env.EMAIL_USER}>`,
                    to: process.env.TEST_EMAIL || 'user@example.com',
                    subject: 'MediLink Notification',
                    text: notification.message,
                    html: `<p>${notification.message}</p>`,
                });
            }

            notification.status = 'sent';
            notification.sentAt = new Date();
            notification.attemptCount += 1;
            await notification.save();
            return result;
        } catch (error) {
            console.error(`Failed to send notification ${notification._id}:`, error);
            notification.status = 'failed';
            notification.error = error.message;
            notification.attemptCount += 1;
            await notification.save();
            throw new Error(`Failed to send notification: ${error.message}`);
        }
    }

    static async processPendingNotifications() {
        try {
            const pending = await Notification.find({
                status: 'pending',
                scheduledTime: { $lte: new Date() },
                attemptCount: { $lt: 3 } // Only try notifications that have failed less than 3 times
            }).limit(10); // Process in batches of 10

            const results = [];
            for (const notification of pending) {
                try {
                    const result = await this.sendNotification(notification);
                    results.push(result);
                } catch (error) {
                    console.error(`Error processing notification ${notification._id}:`, error);
                    continue; // Continue with next notification
                }
            }
            return results;
        } catch (error) {
            console.error('Error processing pending notifications:', error);
            throw error;
        }
    }
}

module.exports = NotificationService;
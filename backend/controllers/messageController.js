const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const NotificationService = require('../utils/notificationService');
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Send a message
router.post('/send', auth, async (req, res) => {
    try {
        const { recipientId, encryptedContent, iv } = req.body;

        if (!recipientId || !encryptedContent || !iv) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const senderId = req.user.id;
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Ensure sender is patient or doctor and recipient is the other role
        if (req.user.role === 'patient' && recipient.role !== 'doctor') {
            return res.status(403).json({ message: 'Patients can only message doctors' });
        }
        if (req.user.role === 'doctor' && recipient.role !== 'patient') {
            return res.status(403).json({ message: 'Doctors can only message patients' });
        }

        const message = new Message({
            senderId,
            recipientId,
            encryptedContent,
            iv,
        });
        await message.save();

        // Notify recipient of new message
        const sender = await User.findById(senderId, 'name');
        await NotificationService.scheduleNotification(
            recipientId,
            message._id,
            'message',
            `New message from ${sender.name}. Please check your inbox.`,
            'email',
            new Date()
        );

        res.status(201).json({ message: 'Message sent successfully', messageId: message._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get messages for the logged-in user
router.get('/inbox', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({
            recipientId: userId,
        }).populate('senderId', 'name');

        if (!messages.length) {
            return res.status(404).json({ message: 'No messages found' });
        }

        res.json(messages.map(msg => ({
            id: msg._id,
            senderName: msg.senderId.name,
            encryptedContent: msg.encryptedContent,
            iv: msg.iv,
            isRead: msg.isRead,
            timestamp: msg.timestamp,
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Mark message as read
router.put('/:messageId/read', auth, async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.recipientId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: cannot mark others\' messages as read' });
        }

        message.isRead = true;
        await message.save();

        res.json({ message: 'Message marked as read' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
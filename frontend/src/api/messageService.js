// src/api/messageService.js
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
    const message = error?.response?.data?.message || fallbackMessage;
    toast.error(message);
    throw new Error(message);
};

const messageService = {
    /* ------------------------------------------------------------------ */
    /*  Messages                                                          */
    /* ------------------------------------------------------------------ */

    /**
     * Send a message
     * @param {Object} data { recipientId, encryptedContent, iv }
     */
    sendMessage: async (data) => {
        try {
            const res = await axiosInstance.post('/messages/send', data);
            toast.success('Message sent successfully!');
            return res.data;          // { message, messageId }
        } catch (error) {
            handleApiError(error, 'Failed to send message');
        }
    },

    /**
     * Get messages for the logged-in user from a specific user
     * @param {String} userId
     */
    getConversation: async (userId) => {
        try {
            const res = await axiosInstance.get(`/messages/conversation/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust token storage as needed
                },
            });
            return res.data;          // Array of messages
        } catch (error) {
            handleApiError(error, 'Could not load conversation');
        }
    },

    /**
     * Get all messages for the logged-in user (grouped by doctor)
     */
    getAllMessages: async () => {
        try {
            const res = await axiosInstance.get('/messages/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust token storage as needed
                },
            });
            return res.data;          // Array of conversation objects
        } catch (error) {
            handleApiError(error, 'Could not load conversations');
        }
    },

    /**
     * Get all messages for the logged-in user
     */
    getInbox: async () => {
        try {
            const res = await axiosInstance.get('/messages/inbox', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust token storage as needed
                },
            });
            return res.data;          // Array of messages
        } catch (error) {
            handleApiError(error, 'Could not load inbox');
        }
    },

    /**
     * Mark a message as read
     * @param {String} messageId
     */
    markAsRead: async (messageId) => {
        try {
            const res = await axiosInstance.put(`/messages/${messageId}/read`, null, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust token storage as needed
                },
            });
            toast.success('Message marked as read');
            return res.data;          // { message }
        } catch (error) {
            handleApiError(error, 'Failed to mark message as read');
        }
    },
};

/* -------------------------------------------------------------------- */
/* Named exports for use inside React components / hooks                */
/* -------------------------------------------------------------------- */
export const {
    sendMessage,
    getConversation,
    getAllMessages,
    getInbox,
    markAsRead,
} = messageService;

export default messageService;
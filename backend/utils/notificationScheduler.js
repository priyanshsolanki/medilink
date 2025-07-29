const cron = require('node-cron');
const NotificationService = require('./notificationService');

class NotificationScheduler {
    static start() {
        // Run every minute to check for pending notifications
        cron.schedule('* * * * *', async () => {
            try {
                console.log('Running notification scheduler...');
                await NotificationService.processPendingNotifications();
            } catch (error) {
                console.error('Notification scheduler error:', error);
            }
        });
        console.log('Notification scheduler started');
    }
}

module.exports = NotificationScheduler;
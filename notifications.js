// Push Notifications System
class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.swRegistration = null;
        this.init();
    }

    async init() {
        await this.registerServiceWorker();
        await this.requestPermission();
        this.setupNotificationListeners();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                this.swRegistration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    async requestPermission() {
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
            console.log('Notification permission:', this.permission);
        }
    }

    setupNotificationListeners() {
        // Listen for new email submissions
        if (window.db) {
            db.collection('emails').onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        this.showNewSubmissionNotification(change.doc.data());
                    }
                });
            });
        }

        // Listen for verification events
        if (window.db) {
            db.collection('email_verifications').onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified' && change.doc.data().verified) {
                        this.showVerificationNotification(change.doc.data());
                    }
                });
            });
        }
    }

    async showNewSubmissionNotification(emailData) {
        if (this.permission !== 'granted') return;

        const notification = new Notification('New Email Submission! 📧', {
            body: `New message from ${emailData.email}`,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            image: '/images/email-icon.png',
            tag: 'new-submission',
            requireInteraction: true,
            actions: [
                {
                    action: 'view',
                    title: 'View Details',
                    icon: '/icons/view-icon.png'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: '/icons/dismiss-icon.png'
                }
            ],
            data: {
                emailId: emailData.id,
                email: emailData.email,
                message: emailData.message
            }
        });

        notification.onclick = () => {
            window.focus();
            this.openEmailDetails(emailData);
            notification.close();
        };

        // Auto-close after 10 seconds
        setTimeout(() => {
            notification.close();
        }, 10000);
    }

    async showVerificationNotification(verificationData) {
        if (this.permission !== 'granted') return;

        const notification = new Notification('Email Verified! ✅', {
            body: `${verificationData.email} has been verified`,
            icon: '/icons/verified-icon.png',
            badge: '/icons/badge-72x72.png',
            tag: 'email-verified',
            requireInteraction: false,
            data: {
                email: verificationData.email,
                verifiedAt: verificationData.verifiedAt
            }
        });

        notification.onclick = () => {
            window.focus();
            this.openAdminDashboard();
            notification.close();
        };
    }

    async showCustomNotification(title, options = {}) {
        if (this.permission !== 'granted') {
            await this.requestPermission();
            if (this.permission !== 'granted') return;
        }

        const defaultOptions = {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            requireInteraction: false
        };

        const notification = new Notification(title, { ...defaultOptions, ...options });

        if (options.onclick) {
            notification.onclick = options.onclick;
        }

        return notification;
    }

    // Browser notification methods
    showBrowserNotification(title, message, type = 'info') {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        this.showCustomNotification(`${icons[type]} ${title}`, {
            body: message,
            tag: type,
            requireInteraction: type === 'error'
        });
    }

    // In-app notification system
    showInAppNotification(title, message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `in-app-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to notification container
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-remove
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }, duration);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Email notification methods
    async sendEmailNotification(to, subject, message, type = 'info') {
        try {
            if (typeof emailjs !== 'undefined') {
                await emailjs.send('your-service-id', 'notification-template', {
                    to_email: to,
                    subject: subject,
                    message: message,
                    notification_type: type
                });
            } else {
                // Store for server-side processing
                await this.storeEmailNotification({
                    to,
                    subject,
                    message,
                    type,
                    sentAt: new Date()
                });
            }
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    }

    async storeEmailNotification(notificationData) {
        if (!window.db) return;

        await db.collection('email_notifications').add({
            ...notificationData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        });
    }

    // Slack/Discord webhook notifications
    async sendWebhookNotification(message, webhookUrl) {
        try {
            const payload = {
                text: message,
                username: 'Email Collector Bot',
                icon_emoji: ':email:'
            };

            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Error sending webhook notification:', error);
        }
    }

    // Notification preferences
    async saveNotificationPreferences(preferences) {
        localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
        
        if (window.db) {
            await db.collection('notification_preferences').doc('user').set({
                ...preferences,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    }

    getNotificationPreferences() {
        const stored = localStorage.getItem('notificationPreferences');
        return stored ? JSON.parse(stored) : {
            browser: true,
            email: false,
            webhook: false,
            sound: true,
            desktop: true
        };
    }

    // Notification history
    async getNotificationHistory(limit = 50) {
        if (!window.db) return [];

        const snapshot = await db.collection('notifications')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    // Utility methods
    openEmailDetails(emailData) {
        // Open email details in admin dashboard
        if (window.location.pathname.includes('admin.html')) {
            window.viewEmailDetails(emailData.id);
        } else {
            window.open('admin.html', '_blank');
        }
    }

    openAdminDashboard() {
        window.open('admin.html', '_blank');
    }

    // Test notifications
    testNotification(type = 'browser') {
        switch (type) {
            case 'browser':
                this.showBrowserNotification('Test Notification', 'This is a test notification from Email Collector', 'info');
                break;
            case 'in-app':
                this.showInAppNotification('Test Notification', 'This is a test in-app notification', 'success');
                break;
            case 'email':
                this.sendEmailNotification('admin@example.com', 'Test Email Notification', 'This is a test email notification');
                break;
        }
    }
}

// Initialize notification manager
window.notificationManager = new NotificationManager();

// Notification UI Components
class NotificationUI {
    static createNotificationSettings() {
        return `
            <div class="notification-settings">
                <h3>Notification Settings</h3>
                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="browserNotifications" checked>
                        Browser Notifications
                    </label>
                </div>
                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="emailNotifications">
                        Email Notifications
                    </label>
                </div>
                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="soundNotifications" checked>
                        Sound Notifications
                    </label>
                </div>
                <div class="setting-group">
                    <label>
                        <input type="checkbox" id="desktopNotifications" checked>
                        Desktop Notifications
                    </label>
                </div>
                <button onclick="NotificationUI.saveSettings()">Save Settings</button>
                <button onclick="NotificationUI.testNotifications()">Test Notifications</button>
            </div>
        `;
    }

    static async saveSettings() {
        const preferences = {
            browser: document.getElementById('browserNotifications').checked,
            email: document.getElementById('emailNotifications').checked,
            sound: document.getElementById('soundNotifications').checked,
            desktop: document.getElementById('desktopNotifications').checked
        };

        await window.notificationManager.saveNotificationPreferences(preferences);
        window.notificationManager.showInAppNotification('Settings Saved', 'Notification preferences updated successfully', 'success');
    }

    static testNotifications() {
        window.notificationManager.testNotification('browser');
        window.notificationManager.testNotification('in-app');
    }

    static loadSettings() {
        const preferences = window.notificationManager.getNotificationPreferences();
        
        document.getElementById('browserNotifications').checked = preferences.browser;
        document.getElementById('emailNotifications').checked = preferences.email;
        document.getElementById('soundNotifications').checked = preferences.sound;
        document.getElementById('desktopNotifications').checked = preferences.desktop;
    }
}

// Make NotificationUI available globally
window.NotificationUI = NotificationUI;

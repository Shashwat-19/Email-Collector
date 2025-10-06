// Email Service for sending verification and confirmation emails
class EmailService {
    constructor() {
        this.apiKey = 'your-emailjs-api-key'; // Replace with your EmailJS API key
        this.serviceId = 'your-service-id'; // Replace with your EmailJS service ID
        this.templateId = 'your-template-id'; // Replace with your EmailJS template ID
    }

    // Send verification email
    async sendVerificationEmail(email, verificationToken) {
        try {
            // Using EmailJS for client-side email sending
            if (typeof emailjs !== 'undefined') {
                const templateParams = {
                    to_email: email,
                    verification_link: `${window.location.origin}/verify?token=${verificationToken}`,
                    verification_code: verificationToken,
                    site_name: 'Email Collector'
                };

                await emailjs.send(this.serviceId, this.templateId, templateParams);
                return { success: true, message: 'Verification email sent successfully' };
            } else {
                // Fallback: Store in Firebase for server-side processing
                await this.storeEmailForVerification(email, verificationToken);
                return { success: true, message: 'Verification request stored' };
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            return { success: false, message: 'Failed to send verification email' };
        }
    }

    // Store email for server-side verification
    async storeEmailForVerification(email, verificationToken) {
        if (!window.db) return;

        await db.collection('email_verifications').add({
            email: email.toLowerCase(),
            token: verificationToken,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            verified: false,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });
    }

    // Send confirmation email after successful submission
    async sendConfirmationEmail(email, message) {
        try {
            if (typeof emailjs !== 'undefined') {
                const templateParams = {
                    to_email: email,
                    user_message: message,
                    site_name: 'Email Collector',
                    submission_date: new Date().toLocaleDateString()
                };

                await emailjs.send(this.serviceId, 'confirmation_template', templateParams);
                return { success: true, message: 'Confirmation email sent' };
            }
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            return { success: false, message: 'Failed to send confirmation email' };
        }
    }

    // Generate verification token
    generateVerificationToken() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15) + 
               Date.now().toString(36);
    }

    // Verify email token
    async verifyEmailToken(token) {
        if (!window.db) return false;

        try {
            const snapshot = await db.collection('email_verifications')
                .where('token', '==', token)
                .where('verified', '==', false)
                .get();

            if (snapshot.empty) {
                return { success: false, message: 'Invalid or expired token' };
            }

            const doc = snapshot.docs[0];
            const data = doc.data();

            // Check if token is expired
            if (data.expiresAt.toDate() < new Date()) {
                return { success: false, message: 'Token has expired' };
            }

            // Mark as verified
            await doc.ref.update({
                verified: true,
                verifiedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return { success: true, email: data.email, message: 'Email verified successfully' };
        } catch (error) {
            console.error('Error verifying token:', error);
            return { success: false, message: 'Verification failed' };
        }
    }
}

// Initialize email service
window.emailService = new EmailService();

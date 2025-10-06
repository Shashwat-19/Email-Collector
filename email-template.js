// Email Templates and Auto-Responder System
class EmailTemplateManager {
    constructor() {
        this.templates = {
            welcome: {
                id: 'welcome',
                name: 'Welcome Email',
                subject: 'Welcome to {{site_name}}!',
                content: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4facfe;">Welcome to {{site_name}}!</h2>
                        <p>Hello {{user_name}},</p>
                        <p>Thank you for your interest in our services. We've received your message and will get back to you soon.</p>
                        <p>Your message: "{{user_message}}"</p>
                        <p>Best regards,<br>The {{site_name}} Team</p>
                    </div>
                `,
                variables: ['site_name', 'user_name', 'user_message']
            },
            confirmation: {
                id: 'confirmation',
                name: 'Confirmation Email',
                subject: 'Thank you for contacting {{site_name}}',
                content: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #10b981;">Message Received!</h2>
                        <p>Dear {{user_name}},</p>
                        <p>We have successfully received your message and it's being processed by our team.</p>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <strong>Your Message:</strong><br>
                            {{user_message}}
                        </div>
                        <p>We'll respond to you within 24 hours.</p>
                        <p>Thank you for choosing {{site_name}}!</p>
                    </div>
                `,
                variables: ['site_name', 'user_name', 'user_message']
            },
            verification: {
                id: 'verification',
                name: 'Email Verification',
                subject: 'Verify your email address - {{site_name}}',
                content: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #f59e0b;">Verify Your Email</h2>
                        <p>Hello,</p>
                        <p>Please verify your email address by clicking the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{{verification_link}}" style="background: #4facfe; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
                        </div>
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all; color: #6b7280;">{{verification_link}}</p>
                        <p>This link will expire in 24 hours.</p>
                    </div>
                `,
                variables: ['site_name', 'verification_link']
            },
            followup: {
                id: 'followup',
                name: 'Follow-up Email',
                subject: 'How was your experience with {{site_name}}?',
                content: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #667eea;">We'd love your feedback!</h2>
                        <p>Hello {{user_name}},</p>
                        <p>We hope you're satisfied with our service. Your feedback is important to us!</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{{feedback_link}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Leave Feedback</a>
                        </div>
                        <p>Thank you for choosing {{site_name}}!</p>
                    </div>
                `,
                variables: ['site_name', 'user_name', 'feedback_link']
            }
        };
        
        this.autoResponderRules = [];
        this.init();
    }

    init() {
        this.loadTemplatesFromFirebase();
        this.loadAutoResponderRules();
    }

    // Template Management
    async loadTemplatesFromFirebase() {
        try {
            if (!window.db) return;
            
            const snapshot = await db.collection('email_templates').get();
            snapshot.docs.forEach(doc => {
                this.templates[doc.id] = { id: doc.id, ...doc.data() };
            });
        } catch (error) {
            console.error('Error loading templates from Firebase:', error);
        }
    }

    async saveTemplate(template) {
        try {
            if (!window.db) return;
            
            await db.collection('email_templates').doc(template.id).set(template);
            this.templates[template.id] = template;
        } catch (error) {
            console.error('Error saving template:', error);
        }
    }

    async deleteTemplate(templateId) {
        try {
            if (!window.db) return;
            
            await db.collection('email_templates').doc(templateId).delete();
            delete this.templates[templateId];
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    }

    // Auto-Responder Rules
    async loadAutoResponderRules() {
        try {
            if (!window.db) return;
            
            const snapshot = await db.collection('auto_responder_rules').get();
            this.autoResponderRules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error loading auto-responder rules:', error);
        }
    }

    async saveAutoResponderRule(rule) {
        try {
            if (!window.db) return;
            
            const docRef = await db.collection('auto_responder_rules').add(rule);
            rule.id = docRef.id;
            this.autoResponderRules.push(rule);
        } catch (error) {
            console.error('Error saving auto-responder rule:', error);
        }
    }

    // Process Auto-Responder
    async processAutoResponder(emailData) {
        try {
            for (const rule of this.autoResponderRules) {
                if (this.evaluateRule(rule, emailData)) {
                    await this.sendAutoResponse(rule, emailData);
                    break; // Only send one auto-response
                }
            }
        } catch (error) {
            console.error('Error processing auto-responder:', error);
        }
    }

    evaluateRule(rule, emailData) {
        // Simple rule evaluation - can be extended
        switch (rule.condition) {
            case 'always':
                return true;
            case 'contains_keyword':
                return emailData.message.toLowerCase().includes(rule.keyword.toLowerCase());
            case 'email_domain':
                return emailData.email.endsWith(rule.domain);
            case 'time_of_day':
                const hour = new Date().getHours();
                return hour >= rule.startHour && hour <= rule.endHour;
            default:
                return false;
        }
    }

    async sendAutoResponse(rule, emailData) {
        try {
            const template = this.templates[rule.templateId];
            if (!template) return;

            const processedContent = this.processTemplate(template, emailData);
            
            // Send email using EmailJS or store for server processing
            if (typeof emailjs !== 'undefined') {
                await emailjs.send('your-service-id', 'your-template-id', {
                    to_email: emailData.email,
                    subject: processedContent.subject,
                    html_content: processedContent.content
                });
            } else {
                // Store for server-side processing
                await this.storeEmailForSending({
                    to: emailData.email,
                    subject: processedContent.subject,
                    content: processedContent.content,
                    type: 'auto_response',
                    ruleId: rule.id
                });
            }

            // Log the auto-response
            await this.logAutoResponse(rule.id, emailData.email);
            
        } catch (error) {
            console.error('Error sending auto-response:', error);
        }
    }

    // Template Processing
    processTemplate(template, data) {
        let subject = template.subject;
        let content = template.content;

        // Replace variables in subject
        template.variables.forEach(variable => {
            const value = data[variable] || `{{${variable}}}`;
            subject = subject.replace(new RegExp(`{{${variable}}}`, 'g'), value);
        });

        // Replace variables in content
        template.variables.forEach(variable => {
            const value = data[variable] || `{{${variable}}}`;
            content = content.replace(new RegExp(`{{${variable}}}`, 'g'), value);
        });

        return { subject, content };
    }

    // Store email for server-side sending
    async storeEmailForSending(emailData) {
        try {
            if (!window.db) return;
            
            await db.collection('pending_emails').add({
                ...emailData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending'
            });
        } catch (error) {
            console.error('Error storing email for sending:', error);
        }
    }

    // Log auto-response
    async logAutoResponse(ruleId, email) {
        try {
            if (!window.db) return;
            
            await db.collection('auto_response_logs').add({
                ruleId,
                email,
                sentAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error logging auto-response:', error);
        }
    }

    // Get all templates
    getAllTemplates() {
        return Object.values(this.templates);
    }

    // Get template by ID
    getTemplate(templateId) {
        return this.templates[templateId];
    }

    // Create new template
    createTemplate(name, subject, content, variables = []) {
        const id = name.toLowerCase().replace(/\s+/g, '_');
        return {
            id,
            name,
            subject,
            content,
            variables,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }

    // Validate template
    validateTemplate(template) {
        const errors = [];
        
        if (!template.name) errors.push('Template name is required');
        if (!template.subject) errors.push('Template subject is required');
        if (!template.content) errors.push('Template content is required');
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Get template variables from content
    extractVariables(content) {
        const regex = /{{([^}]+)}}/g;
        const variables = [];
        let match;
        
        while ((match = regex.exec(content)) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }
        
        return variables;
    }

    // Preview template with sample data
    previewTemplate(templateId, sampleData = {}) {
        const template = this.getTemplate(templateId);
        if (!template) return null;

        const defaultData = {
            site_name: 'Email Collector',
            user_name: 'John Doe',
            user_message: 'This is a sample message for preview purposes.',
            verification_link: 'https://example.com/verify?token=abc123',
            feedback_link: 'https://example.com/feedback'
        };

        const data = { ...defaultData, ...sampleData };
        return this.processTemplate(template, data);
    }
}

// Initialize email template manager
window.emailTemplateManager = new EmailTemplateManager();

// Template Editor Functions
window.templateEditor = {
    openEditor: function(templateId = null) {
        const template = templateId ? window.emailTemplateManager.getTemplate(templateId) : null;
        
        // Create modal for template editor
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3>${template ? 'Edit Template' : 'Create New Template'}</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="templateForm">
                        <div class="form-group">
                            <label>Template Name</label>
                            <input type="text" id="templateName" value="${template?.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Subject</label>
                            <input type="text" id="templateSubject" value="${template?.subject || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Content (HTML)</label>
                            <textarea id="templateContent" rows="10" required>${template?.content || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Available Variables</label>
                            <div class="variables-list">
                                <span class="variable-tag" onclick="insertVariable('site_name')">{{site_name}}</span>
                                <span class="variable-tag" onclick="insertVariable('user_name')">{{user_name}}</span>
                                <span class="variable-tag" onclick="insertVariable('user_message')">{{user_message}}</span>
                                <span class="variable-tag" onclick="insertVariable('verification_link')">{{verification_link}}</span>
                                <span class="variable-tag" onclick="insertVariable('feedback_link')">{{feedback_link}}</span>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" onclick="previewTemplate()">Preview</button>
                            <button type="submit">${template ? 'Update' : 'Create'} Template</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('templateForm').addEventListener('submit', function(e) {
            e.preventDefault();
            saveTemplate(templateId);
        });
    }
};

// Helper functions
window.insertVariable = function(variable) {
    const textarea = document.getElementById('templateContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, start) + `{{${variable}}}` + text.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
};

window.previewTemplate = function() {
    const name = document.getElementById('templateName').value;
    const subject = document.getElementById('templateSubject').value;
    const content = document.getElementById('templateContent').value;
    
    const template = {
        name,
        subject,
        content,
        variables: window.emailTemplateManager.extractVariables(content + subject)
    };
    
    const preview = window.emailTemplateManager.processTemplate(template, {
        site_name: 'Email Collector',
        user_name: 'John Doe',
        user_message: 'This is a sample message for preview purposes.',
        verification_link: 'https://example.com/verify?token=abc123'
    });
    
    // Show preview in new window
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
        <html>
            <head><title>Template Preview</title></head>
            <body>
                <h2>Subject: ${preview.subject}</h2>
                <hr>
                ${preview.content}
            </body>
        </html>
    `);
};

window.saveTemplate = async function(templateId) {
    const name = document.getElementById('templateName').value;
    const subject = document.getElementById('templateSubject').value;
    const content = document.getElementById('templateContent').value;
    
    const template = {
        id: templateId || name.toLowerCase().replace(/\s+/g, '_'),
        name,
        subject,
        content,
        variables: window.emailTemplateManager.extractVariables(content + subject),
        updatedAt: new Date()
    };
    
    const validation = window.emailTemplateManager.validateTemplate(template);
    if (!validation.isValid) {
        alert('Validation errors: ' + validation.errors.join(', '));
        return;
    }
    
    await window.emailTemplateManager.saveTemplate(template);
    document.querySelector('.modal').remove();
    
    // Refresh templates list if on admin page
    if (typeof loadTemplates === 'function') {
        loadTemplates();
    }
};

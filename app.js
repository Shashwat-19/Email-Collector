// Email Collector Application
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const btnLoader = document.getElementById('btnLoader');
    const btnText = document.querySelector('.btn-text');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Form data object
    const formData = {
        email: '',
        message: ''
    };

    // Rate limiting
    const RATE_LIMIT = {
        maxSubmissions: 3,
        timeWindow: 60000, // 1 minute
        submissions: []
    };

    // Initialize the application
    init();

    function init() {
        // Add event listeners
        emailInput.addEventListener('input', handleEmailInput);
        messageInput.addEventListener('input', handleMessageInput);
        emailForm.addEventListener('submit', handleFormSubmit);
        
        // Initialize theme toggle
        initThemeToggle();
        
        // Initialize analytics
        initAnalytics();
        
        // Check if Firebase is properly configured
        checkFirebaseConfig();
    }

    // Theme Toggle Functionality
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;
        
        // Get saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Add animation
            body.style.transition = 'all 0.3s ease-in-out';
        setTimeout(() => {
                body.style.transition = '';
            }, 300);
        });
    }
    
    function updateThemeIcon(theme) {
        const themeIcon = document.getElementById('themeIcon');
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // Check Firebase configuration
    function checkFirebaseConfig() {
        if (!window.db) {
            console.error('Firebase not properly initialized. Please check your configuration.');
            showGlobalError('Firebase configuration error. Please check your setup.');
        }
    }

    // Handle email input
    function handleEmailInput(e) {
        const value = e.target.value.trim();
        formData.email = value;
        
        if (value === '') {
            showFieldError(emailError, 'Email address is required');
            return;
        }
        
        if (!isValidEmail(value)) {
            showFieldError(emailError, 'Please enter a valid email address');
            return;
        }
        
        clearFieldError(emailError);
        updateSubmitButton();
    }

    // Handle message input
    function handleMessageInput(e) {
        const value = e.target.value.trim();
        formData.message = value;
        
        if (value === '') {
            showFieldError(messageError, 'Message is required');
            return;
        }
        
        if (value.length < 10) {
            showFieldError(messageError, 'Message must be at least 10 characters long');
            return;
        }

        clearFieldError(messageError);
        updateSubmitButton();
    }

    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Check rate limiting
        if (!checkRateLimit()) {
            return;
        }

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        setLoadingState(true);
        hideAllMessages();
        
        try {
            // Save to Firebase
            await saveToFirebase(formData);
            
            // Record submission for rate limiting
            recordSubmission();
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            resetForm();
            
        } catch (error) {
            console.error('Error saving data:', error);
            showGlobalError('Failed to save your message. Please try again.');
        } finally {
            // Hide loading state
            setLoadingState(false);
        }
    }

    // Validate form
    function validateForm() {
        let isValid = true;
        
        // Validate email
        if (!formData.email || !isValidEmail(formData.email)) {
            showFieldError(emailError, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (!formData.message || formData.message.length < 10) {
            showFieldError(messageError, 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        return isValid;
    }

    // Save data to Firebase
    async function saveToFirebase(data) {
        if (!window.db) {
            throw new Error('Firebase not initialized');
        }
        
        const emailData = {
            email: data.email.toLowerCase(),
            message: data.message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent,
            ipAddress: await getClientIP()
        };
        
        // Add document to Firestore
        const docRef = await db.collection('emails').add(emailData);
        
        console.log('Document written with ID: ', docRef.id);
        return docRef.id;
    }

    // Get client IP address (for analytics)
    async function getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.warn('Could not get IP address:', error);
            return 'unknown';
        }
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show field error
    function showFieldError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Clear field error
    function clearFieldError(errorElement) {
        errorElement.classList.remove('show');
    }

    // Update submit button state
    function updateSubmitButton() {
        const isFormValid = formData.email && 
                           formData.message && 
                           isValidEmail(formData.email) && 
                           formData.message.length >= 10;
        
        submitBtn.disabled = !isFormValid;
    }

    // Set loading state
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            updateSubmitButton();
        }
    }

    // Show success message
    function showSuccessMessage() {
        successMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }

    // Show global error message
    function showGlobalError(message) {
        errorMessage.querySelector('span').textContent = message;
        errorMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }

    // Hide all messages
    function hideAllMessages() {
        successMessage.classList.remove('show');
        errorMessage.classList.remove('show');
    }

    // Reset form
    function resetForm() {
        emailForm.reset();
        formData.email = '';
        formData.message = '';
        clearFieldError(emailError);
        clearFieldError(messageError);
        updateSubmitButton();
    }

    // Utility function to format timestamp
    function formatTimestamp(timestamp) {
        if (!timestamp) return 'Unknown';
        
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    }

    // Analytics function (optional)
    function trackFormSubmission() {
        // You can integrate with Google Analytics, Mixpanel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: 'email_collector'
            });
        }
    }

    // Rate limiting functions
    function checkRateLimit() {
        const now = Date.now();
        
        // Clean old submissions
        RATE_LIMIT.submissions = RATE_LIMIT.submissions.filter(
            timestamp => now - timestamp < RATE_LIMIT.timeWindow
        );
        
        // Check if limit exceeded
        if (RATE_LIMIT.submissions.length >= RATE_LIMIT.maxSubmissions) {
            const timeLeft = Math.ceil((RATE_LIMIT.timeWindow - (now - RATE_LIMIT.submissions[0])) / 1000);
            showGlobalError(`Too many submissions. Please wait ${timeLeft} seconds before trying again.`);
            return false;
        }
        
        return true;
    }
    
    function recordSubmission() {
        RATE_LIMIT.submissions.push(Date.now());
    }

    // Honeypot field for spam protection
    function addHoneypotField() {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.display = 'none';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';
        emailForm.appendChild(honeypot);
        
        // Check honeypot on form submission
        emailForm.addEventListener('submit', function(e) {
            if (honeypot.value !== '') {
                e.preventDefault();
                console.log('Spam detected - honeypot field filled');
                return false;
            }
        });
    }

    // Initialize honeypot
    addHoneypotField();

    // Analytics and Statistics
    function initAnalytics() {
        // Track page view
        trackPageView();
        
        // Load statistics
        loadStatistics();
        
        // Set up real-time updates
        setInterval(loadStatistics, 30000); // Update every 30 seconds
    }
    
    function trackPageView() {
        // Store visitor info
        const visitorData = {
            timestamp: new Date(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
        
        // Store in localStorage for session tracking
        const sessionId = generateSessionId();
        localStorage.setItem('emailCollectorSession', JSON.stringify({
            sessionId,
            ...visitorData
        }));
        
        // Track with analytics (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Email Collector',
                page_location: window.location.href
            });
        }
    }
    
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    async function loadStatistics() {
        try {
            if (!window.db) return;
            
            // Get total emails
            const totalSnapshot = await db.collection('emails').get();
            const totalEmails = totalSnapshot.size;
            
            // Get today's emails
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todaySnapshot = await db.collection('emails')
                .where('timestamp', '>=', today)
                .get();
            const todayEmails = todaySnapshot.size;
            
            // Get unique visitors (stored in separate collection)
            const visitorsSnapshot = await db.collection('visitors').get();
            const uniqueVisitors = visitorsSnapshot.size;
            
            // Calculate conversion rate (simplified)
            const conversionRate = uniqueVisitors > 0 ? 
                Math.round((totalEmails / uniqueVisitors) * 100) : 0;
            
            // Update UI
            updateStatisticsDisplay({
                totalEmails,
                todayEmails,
                uniqueVisitors,
                conversionRate
            });
            
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }
    
    function updateStatisticsDisplay(stats) {
        // Animate numbers
        animateNumber('totalEmails', stats.totalEmails);
        animateNumber('todayEmails', stats.todayEmails);
        animateNumber('uniqueVisitors', stats.uniqueVisitors);
        animateNumber('conversionRate', stats.conversionRate + '%');
    }
    
    function animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const target = parseInt(targetValue) || 0;
        const increment = Math.ceil((target - currentValue) / 20);
        
        if (currentValue !== target) {
            const timer = setInterval(() => {
                const newValue = parseInt(element.textContent) + increment;
                if (newValue >= target) {
                    element.textContent = targetValue;
                    clearInterval(timer);
                } else {
                    element.textContent = newValue;
                }
            }, 50);
        }
    }
    
    // Track form interactions
    function trackFormInteraction(action, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'form_interaction',
                event_label: 'email_collector',
                ...data
            });
        }
        
        // Store in Firebase for detailed analytics
        if (window.db) {
            db.collection('analytics').add({
                action,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                sessionId: getSessionId(),
                ...data
            });
        }
    }
    
    function getSessionId() {
        const session = localStorage.getItem('emailCollectorSession');
        return session ? JSON.parse(session).sessionId : 'unknown';
    }

    // Export functions for testing (if needed)
    window.emailCollector = {
        validateForm,
        isValidEmail,
        saveToFirebase,
        resetForm,
        checkRateLimit
    };
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
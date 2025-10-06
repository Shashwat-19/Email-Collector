// Sign Up Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const signupForm = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const agreeTermsInput = document.getElementById('agreeTerms');
    const submitBtn = document.getElementById('submitBtn');
    const btnLoader = document.getElementById('btnLoader');
    const btnText = document.querySelector('.btn-text');
    
    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const termsError = document.getElementById('termsError');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Password strength elements
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    // Password toggle elements
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

    // Form data object
    const formData = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    };

    // Initialize the application
    init();

    function init() {
        // Add event listeners
        fullNameInput.addEventListener('input', handleNameInput);
        emailInput.addEventListener('input', handleEmailInput);
        passwordInput.addEventListener('input', handlePasswordInput);
        confirmPasswordInput.addEventListener('input', handleConfirmPasswordInput);
        agreeTermsInput.addEventListener('change', handleTermsChange);
        signupForm.addEventListener('submit', handleFormSubmit);
        
        // Password toggle listeners
        passwordToggle.addEventListener('click', togglePasswordVisibility);
        confirmPasswordToggle.addEventListener('click', toggleConfirmPasswordVisibility);
        
        // Initialize theme toggle
        initThemeToggle();
        
        // Check if Firebase is properly configured
        checkFirebaseConfig();
    }

    // Theme Toggle Functionality
    function initThemeToggle() {
        const body = document.body;
        
        // Get saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
    }

    // Check Firebase configuration
    function checkFirebaseConfig() {
        if (!window.db || !window.firebase) {
            console.error('Firebase not properly initialized. Please check your configuration.');
            showGlobalError('Firebase configuration error. Please check your setup.');
        }
    }

    // Handle name input
    function handleNameInput(e) {
        const value = e.target.value.trim();
        formData.fullName = value;
        
        if (value === '') {
            showFieldError(nameError, 'Full name is required');
            return;
        }
        
        if (value.length < 2) {
            showFieldError(nameError, 'Name must be at least 2 characters long');
            return;
        }
        
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showFieldError(nameError, 'Name can only contain letters and spaces');
            return;
        }
        
        clearFieldError(nameError);
        updateSubmitButton();
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

    // Handle password input
    function handlePasswordInput(e) {
        const value = e.target.value;
        formData.password = value;
        
        if (value === '') {
            showFieldError(passwordError, 'Password is required');
            updatePasswordStrength(0);
            return;
        }
        
        if (value.length < 8) {
            showFieldError(passwordError, 'Password must be at least 8 characters long');
            updatePasswordStrength(1);
            return;
        }
        
        const strength = calculatePasswordStrength(value);
        updatePasswordStrength(strength);
        
        if (strength < 3) {
            showFieldError(passwordError, 'Password is too weak. Please use a stronger password');
            return;
        }
        
        clearFieldError(passwordError);
        
        // Check if confirm password matches
        if (formData.confirmPassword && value !== formData.confirmPassword) {
            showFieldError(confirmPasswordError, 'Passwords do not match');
        } else {
            clearFieldError(confirmPasswordError);
        }
        
        updateSubmitButton();
    }

    // Handle confirm password input
    function handleConfirmPasswordInput(e) {
        const value = e.target.value;
        formData.confirmPassword = value;
        
        if (value === '') {
            showFieldError(confirmPasswordError, 'Please confirm your password');
            return;
        }
        
        if (value !== formData.password) {
            showFieldError(confirmPasswordError, 'Passwords do not match');
            return;
        }
        
        clearFieldError(confirmPasswordError);
        updateSubmitButton();
    }

    // Handle terms agreement
    function handleTermsChange(e) {
        formData.agreeTerms = e.target.checked;
        
        if (!e.target.checked) {
            showFieldError(termsError, 'You must agree to the terms and conditions');
        } else {
            clearFieldError(termsError);
        }
        
        updateSubmitButton();
    }

    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        hideAllMessages();
        
        try {
            // Create user account
            const result = await window.authManager.signUp(formData.email, formData.password, {
                name: formData.fullName
            });
            
            if (result.success) {
                // Show success message
                showSuccessMessage();
                
                // Send verification email
                await sendVerificationEmail(result.user);
                
                // Reset form
                resetForm();
                
                // Redirect to main page after 3 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
                
            } else {
                showGlobalError(result.error || 'Failed to create account. Please try again.');
            }
            
        } catch (error) {
            console.error('Error creating account:', error);
            showGlobalError('An unexpected error occurred. Please try again.');
        } finally {
            // Hide loading state
            setLoadingState(false);
        }
    }

    // Validate form
    function validateForm() {
        let isValid = true;
        
        // Validate name
        if (!formData.fullName || formData.fullName.length < 2) {
            showFieldError(nameError, 'Please enter a valid name');
            isValid = false;
        }
        
        // Validate email
        if (!formData.email || !isValidEmail(formData.email)) {
            showFieldError(emailError, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!formData.password || calculatePasswordStrength(formData.password) < 3) {
            showFieldError(passwordError, 'Please enter a strong password');
            isValid = false;
        }
        
        // Validate confirm password
        if (!formData.confirmPassword || formData.confirmPassword !== formData.password) {
            showFieldError(confirmPasswordError, 'Passwords do not match');
            isValid = false;
        }
        
        // Validate terms
        if (!formData.agreeTerms) {
            showFieldError(termsError, 'You must agree to the terms and conditions');
            isValid = false;
        }
        
        return isValid;
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password strength calculation
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return Math.min(strength, 5);
    }

    // Update password strength indicator
    function updatePasswordStrength(strength) {
        const strengthLevels = [
            { text: 'Very Weak', color: '#ef4444', width: '20%' },
            { text: 'Weak', color: '#f59e0b', width: '40%' },
            { text: 'Fair', color: '#eab308', width: '60%' },
            { text: 'Good', color: '#22c55e', width: '80%' },
            { text: 'Strong', color: '#16a34a', width: '100%' }
        ];
        
        const level = strengthLevels[strength - 1] || strengthLevels[0];
        
        strengthFill.style.width = level.width;
        strengthFill.style.backgroundColor = level.color;
        strengthText.textContent = level.text;
        strengthText.style.color = level.color;
    }

    // Toggle password visibility
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = passwordToggle.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }

    // Toggle confirm password visibility
    function toggleConfirmPasswordVisibility() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        
        const icon = confirmPasswordToggle.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }

    // Send verification email
    async function sendVerificationEmail(user) {
        try {
            if (user && user.sendEmailVerification) {
                await user.sendEmailVerification();
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
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
        const isFormValid = formData.fullName && 
                           formData.email && 
                           formData.password && 
                           formData.confirmPassword &&
                           formData.agreeTerms &&
                           isValidEmail(formData.email) && 
                           calculatePasswordStrength(formData.password) >= 3 &&
                           formData.password === formData.confirmPassword;
        
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
        signupForm.reset();
        formData.fullName = '';
        formData.email = '';
        formData.password = '';
        formData.confirmPassword = '';
        formData.agreeTerms = false;
        
        clearFieldError(nameError);
        clearFieldError(emailError);
        clearFieldError(passwordError);
        clearFieldError(confirmPasswordError);
        clearFieldError(termsError);
        
        updatePasswordStrength(0);
        updateSubmitButton();
    }

    // Initialize password strength on page load
    updatePasswordStrength(0);
    updateSubmitButton();
});

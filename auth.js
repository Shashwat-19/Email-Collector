// User Management and Authentication System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userRoles = {
            admin: ['read', 'write', 'delete', 'manage_users', 'view_analytics'],
            moderator: ['read', 'write', 'view_analytics'],
            user: ['read']
        };
        this.init();
    }

    init() {
        this.setupAuthStateListener();
        this.checkAuthState();
    }

    // Firebase Auth Setup
    setupAuthStateListener() {
        if (firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                this.currentUser = user;
                this.updateUI(user);
                this.checkUserPermissions(user);
            });
        }
    }

    async checkAuthState() {
        if (firebase.auth) {
            const user = firebase.auth().currentUser;
            if (user) {
                this.currentUser = user;
                await this.loadUserProfile(user.uid);
            }
        }
    }

    // Authentication Methods
    async signIn(email, password) {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            await this.loadUserProfile(userCredential.user.uid);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signUp(email, password, userData = {}) {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await this.createUserProfile(userCredential.user.uid, {
                email,
                ...userData,
                role: 'user',
                createdAt: new Date(),
                isActive: true
            });
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            await firebase.auth().signOut();
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    async resetPassword(email) {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: error.message };
        }
    }

    // User Profile Management
    async createUserProfile(uid, userData) {
        if (!window.db) return;

        await db.collection('users').doc(uid).set({
            ...userData,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    async loadUserProfile(uid) {
        if (!window.db) return null;

        try {
            const doc = await db.collection('users').doc(uid).get();
            if (doc.exists) {
                const userData = doc.data();
                this.currentUser = { ...this.currentUser, profile: userData };
                return userData;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
        return null;
    }

    async updateUserProfile(uid, updates) {
        if (!window.db) return;

        await db.collection('users').doc(uid).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    // Role and Permission Management
    async assignRole(uid, role) {
        if (!this.hasPermission('manage_users')) {
            throw new Error('Insufficient permissions');
        }

        await this.updateUserProfile(uid, { role });
    }

    hasPermission(permission) {
        if (!this.currentUser || !this.currentUser.profile) return false;
        
        const userRole = this.currentUser.profile.role || 'user';
        const rolePermissions = this.userRoles[userRole] || [];
        
        return rolePermissions.includes(permission);
    }

    getUserRole() {
        return this.currentUser?.profile?.role || 'user';
    }

    // User Management
    async getAllUsers() {
        if (!this.hasPermission('manage_users')) {
            throw new Error('Insufficient permissions');
        }

        if (!window.db) return [];

        const snapshot = await db.collection('users').get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async updateUserStatus(uid, isActive) {
        if (!this.hasPermission('manage_users')) {
            throw new Error('Insufficient permissions');
        }

        await this.updateUserProfile(uid, { isActive });
    }

    async deleteUser(uid) {
        if (!this.hasPermission('manage_users')) {
            throw new Error('Insufficient permissions');
        }

        if (!window.db) return;

        // Delete user data
        await db.collection('users').doc(uid).delete();
        
        // Delete user's auth account
        if (firebase.auth) {
            await firebase.auth().deleteUser(uid);
        }
    }

    // Session Management
    async updateLastActivity() {
        if (!this.currentUser || !window.db) return;

        await db.collection('users').doc(this.currentUser.uid).update({
            lastActivity: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    async getActiveUsers() {
        if (!window.db) return [];

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const snapshot = await db.collection('users')
            .where('lastActivity', '>=', fiveMinutesAgo)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    // UI Updates
    updateUI(user) {
        const authElements = document.querySelectorAll('[data-auth]');
        authElements.forEach(element => {
            const authState = element.getAttribute('data-auth');
            const shouldShow = (authState === 'authenticated' && user) || 
                             (authState === 'unauthenticated' && !user);
            element.style.display = shouldShow ? 'block' : 'none';
        });

        // Update user info
        if (user) {
            const userInfoElements = document.querySelectorAll('[data-user-info]');
            userInfoElements.forEach(element => {
                const infoType = element.getAttribute('data-user-info');
                element.textContent = this.getUserInfo(infoType);
            });
        }
    }

    getUserInfo(infoType) {
        if (!this.currentUser) return '';

        switch (infoType) {
            case 'email':
                return this.currentUser.email || '';
            case 'name':
                return this.currentUser.profile?.name || this.currentUser.email || '';
            case 'role':
                return this.currentUser.profile?.role || 'user';
            default:
                return '';
        }
    }

    checkUserPermissions(user) {
        if (!user) return;

        // Hide/show elements based on permissions
        const permissionElements = document.querySelectorAll('[data-permission]');
        permissionElements.forEach(element => {
            const requiredPermission = element.getAttribute('data-permission');
            const hasPermission = this.hasPermission(requiredPermission);
            element.style.display = hasPermission ? 'block' : 'none';
        });
    }

    // Security
    async logSecurityEvent(event, details = {}) {
        if (!window.db) return;

        await db.collection('security_logs').add({
            userId: this.currentUser?.uid || 'anonymous',
            event,
            details,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ipAddress: await this.getClientIP(),
            userAgent: navigator.userAgent
        });
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
}

// Initialize auth manager
window.authManager = new AuthManager();

// Auth UI Components
class AuthUI {
    static showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Sign In</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="loginForm">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="loginEmail" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="loginPassword" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit">Sign In</button>
                            <button type="button" onclick="AuthUI.showSignUpModal()">Sign Up</button>
                            <button type="button" onclick="AuthUI.showForgotPasswordModal()">Forgot Password?</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await window.authManager.signIn(email, password);
            if (result.success) {
                modal.remove();
                window.notificationManager?.showInAppNotification('Welcome!', 'Successfully signed in', 'success');
            } else {
                window.notificationManager?.showInAppNotification('Sign In Failed', result.error, 'error');
            }
        });
    }

    static showSignUpModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Sign Up</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="signUpForm">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="signUpName" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="signUpEmail" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="signUpPassword" required>
                        </div>
                        <div class="form-group">
                            <label>Confirm Password</label>
                            <input type="password" id="signUpConfirmPassword" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit">Sign Up</button>
                            <button type="button" onclick="AuthUI.showLoginModal()">Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('signUpForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signUpName').value;
            const email = document.getElementById('signUpEmail').value;
            const password = document.getElementById('signUpPassword').value;
            const confirmPassword = document.getElementById('signUpConfirmPassword').value;
            
            if (password !== confirmPassword) {
                window.notificationManager?.showInAppNotification('Error', 'Passwords do not match', 'error');
                return;
            }
            
            const result = await window.authManager.signUp(email, password, { name });
            if (result.success) {
                modal.remove();
                window.notificationManager?.showInAppNotification('Welcome!', 'Account created successfully', 'success');
            } else {
                window.notificationManager?.showInAppNotification('Sign Up Failed', result.error, 'error');
            }
        });
    }

    static showForgotPasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Reset Password</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="forgotPasswordForm">
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="forgotPasswordEmail" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit">Send Reset Email</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgotPasswordEmail').value;
            
            const result = await window.authManager.resetPassword(email);
            if (result.success) {
                modal.remove();
                window.notificationManager?.showInAppNotification('Reset Email Sent', 'Check your email for password reset instructions', 'success');
            } else {
                window.notificationManager?.showInAppNotification('Reset Failed', result.error, 'error');
            }
        });
    }

    static showUserProfile() {
        const user = window.authManager.currentUser;
        if (!user) return;

        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>User Profile</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="profile-info">
                        <div class="profile-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="profile-details">
                            <h4>${user.profile?.name || user.email}</h4>
                            <p>Email: ${user.email}</p>
                            <p>Role: ${user.profile?.role || 'user'}</p>
                            <p>Member since: ${user.profile?.createdAt ? new Date(user.profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button onclick="AuthUI.showEditProfileModal()">Edit Profile</button>
                        <button onclick="AuthUI.signOut()">Sign Out</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    static async signOut() {
        const result = await window.authManager.signOut();
        if (result.success) {
            window.notificationManager?.showInAppNotification('Signed Out', 'You have been successfully signed out', 'info');
        }
    }
}

// Make AuthUI available globally
window.AuthUI = AuthUI;

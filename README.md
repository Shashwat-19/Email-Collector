# 📧 Email Collector - Enterprise-Grade Email Collection Platform

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Firebase](https://img.shields.io/badge/Firebase-9.22.0-orange.svg)](https://firebase.google.com/)
[![Responsive](https://img.shields.io/badge/Responsive-Yes-green.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple.svg)](https://web.dev/progressive-web-apps/)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen.svg)](https://opensource.org/)

A modern, feature-rich email collection platform built with HTML, CSS, JavaScript, and Firebase. Perfect for businesses, developers, and organizations looking to collect user emails with a professional, secure, and scalable solution.

![Email Collector Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Glassmorphism Design** - Beautiful glass-like effects with backdrop blur
- **Dark/Light Theme Toggle** - User preference with persistent storage
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Smooth Animations** - Micro-interactions and transitions
- **Accessibility Ready** - WCAG compliant with proper focus management

### 🔐 **Security & Authentication**
- **Firebase Authentication** - Secure user management
- **Email Verification** - Double opt-in with confirmation emails
- **Rate Limiting** - Prevents spam and abuse (3 submissions/minute)
- **Honeypot Protection** - Bot detection and blocking
- **Input Validation** - Comprehensive client and server-side validation
- **Role-Based Access** - Admin, Moderator, and User roles

### 📊 **Analytics & Insights**
- **Real-time Dashboard** - Live statistics and metrics
- **Interactive Charts** - Beautiful data visualization with Chart.js
- **Conversion Tracking** - Funnel analysis and performance metrics
- **Geographic Analytics** - User location insights
- **Device Analytics** - Desktop, mobile, and tablet breakdown
- **Export Capabilities** - CSV and JSON data export

### 🔔 **Notifications & Communication**
- **Push Notifications** - Browser and in-app notifications
- **Email Templates** - Customizable email templates
- **Auto-Responder** - Automated email responses
- **Real-time Alerts** - Instant notifications for new submissions
- **Multi-channel Support** - Email, webhook, and Slack integration

### 🌍 **Internationalization**
- **Multi-language Support** - English, Spanish, French, German
- **Language Switcher** - Easy language selection
- **Persistent Preferences** - Remembers user language choice
- **RTL Support** - Right-to-left language compatibility

### 📱 **Progressive Web App (PWA)**
- **Offline Functionality** - Works without internet connection
- **App-like Experience** - Installable on mobile devices
- **Service Worker** - Background sync and caching
- **Push Notifications** - Native app-like notifications

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Firebase account
- EmailJS account (optional, for email sending)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/email-collector.git
cd email-collector
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

#### Enable Services
```bash
# Enable Authentication
- Go to Authentication > Sign-in method
- Enable Email/Password provider

# Enable Firestore Database
- Go to Firestore Database
- Click "Create database"
- Choose "Start in test mode" (for development)
- Select your preferred location

# Enable Hosting (optional)
- Go to Hosting
- Click "Get started"
- Follow the setup instructions
```

#### Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Add app" and select Web
4. Copy the configuration object

#### Update Configuration
Edit `firebase-config.js`:
```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 3. EmailJS Setup (Optional)

#### Create EmailJS Account
1. Go to [EmailJS](https://www.emailjs.com/)
2. Create a free account
3. Create an email service (Gmail, Outlook, etc.)
4. Create email templates

#### Update Email Service
Edit `email-service.js`:
```javascript
const emailService = {
    apiKey: 'your-emailjs-api-key',
    serviceId: 'your-service-id',
    templateId: 'your-template-id'
};
```

### 4. Deploy

#### Option A: Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

#### Option B: Netlify
1. Connect your GitHub repository
2. Build command: (leave empty)
3. Publish directory: `/`
4. Deploy!

#### Option C: Vercel
1. Import your GitHub repository
2. Framework preset: Other
3. Deploy!

#### Option D: Local Development
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## 📁 Project Structure

```
email-collector/
├── 📄 index.html              # Main email collection form
├── 📄 signup.html             # User registration page
├── 📄 admin.html              # Admin dashboard
├── 🎨 styles.css              # Main stylesheet
├── 🎨 admin.css               # Admin-specific styles
├── ⚙️ app.js                  # Main application logic
├── ⚙️ signup.js               # Sign-up page logic
├── ⚙️ admin.js                # Admin dashboard logic
├── ⚙️ firebase-config.js      # Firebase configuration
├── ⚙️ email-service.js        # Email sending service
├── ⚙️ email-templates.js      # Template management
├── ⚙️ notifications.js        # Push notifications
├── ⚙️ auth.js                 # Authentication system
├── ⚙️ analytics.js            # Analytics dashboard
├── ⚙️ languages.js            # Multi-language support
├── ⚙️ sw.js                   # Service Worker
├── 📱 manifest.json           # PWA manifest
└── 📖 README.md               # This file
```

## 🎯 Usage

### For End Users
1. **Visit the Form** - Navigate to your deployed URL
2. **Enter Email** - Provide your email address
3. **Write Message** - Add your message
4. **Submit** - Click send button
5. **Verify Email** - Check email for verification (if enabled)

### For Administrators
1. **Sign Up/In** - Create account or sign in
2. **Access Dashboard** - Go to admin panel
3. **View Submissions** - See all collected emails
4. **Export Data** - Download CSV/JSON files
5. **Manage Users** - Control user access and roles

## 🔧 Configuration

### Environment Variables
```javascript
// Firebase Configuration
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id

// EmailJS Configuration (Optional)
EMAILJS_API_KEY=your-emailjs-key
EMAILJS_SERVICE_ID=your-service-id
EMAILJS_TEMPLATE_ID=your-template-id
```

### Customization Options

#### Colors and Themes
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-color: #4facfe;
    --success-color: #10b981;
    --error-color: #ef4444;
    /* ... more variables */
}
```

#### Form Fields
Add custom fields in `index.html` and update validation in `app.js`:
```javascript
// Add new field validation
function validateCustomField(value) {
    // Your validation logic
    return isValid;
}
```

#### Email Templates
Create custom templates in `email-templates.js`:
```javascript
const customTemplate = {
    id: 'custom',
    name: 'Custom Template',
    subject: 'Your Subject Here',
    content: '<div>Your HTML content</div>',
    variables: ['variable1', 'variable2']
};
```

## 📊 Analytics & Monitoring

### Available Metrics
- **Total Submissions** - Count of all email submissions
- **Daily Submissions** - Submissions per day
- **Conversion Rate** - Form completion percentage
- **Geographic Data** - User location insights
- **Device Analytics** - Desktop vs mobile usage
- **Email Domains** - Most common email providers

### Export Options
- **CSV Export** - Spreadsheet-compatible format
- **JSON Export** - Developer-friendly format
- **Filtered Export** - Date range and criteria filtering

## 🔒 Security Features

### Data Protection
- **Encryption in Transit** - HTTPS/TLS encryption
- **Encryption at Rest** - Firebase security
- **Input Sanitization** - XSS prevention
- **CSRF Protection** - Cross-site request forgery prevention

### Access Control
- **Role-Based Permissions** - Admin, Moderator, User roles
- **Session Management** - Secure session handling
- **Rate Limiting** - Abuse prevention
- **IP Tracking** - Security monitoring

### Privacy Compliance
- **GDPR Ready** - Data protection compliance
- **Cookie Consent** - Privacy policy integration
- **Data Retention** - Configurable data storage
- **User Rights** - Data access and deletion

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 60+ | ✅ Full |
| Firefox | 55+ | ✅ Full |
| Safari | 12+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| Opera | 47+ | ✅ Full |
| Mobile Safari | 12+ | ✅ Full |
| Chrome Mobile | 60+ | ✅ Full |

## 📱 Mobile Features

- **Responsive Design** - Optimized for all screen sizes
- **Touch-Friendly** - Large buttons and touch targets
- **Offline Support** - Works without internet
- **App Installation** - Add to home screen
- **Push Notifications** - Native mobile notifications

## 🚀 Performance

### Optimization Features
- **Lazy Loading** - Images and components load on demand
- **Code Splitting** - Modular JavaScript loading
- **Caching** - Service Worker caching strategy
- **Compression** - Gzip/Brotli compression
- **CDN Ready** - Static asset optimization

### Performance Metrics
- **First Contentful Paint** - < 1.5s
- **Largest Contentful Paint** - < 2.5s
- **Cumulative Layout Shift** - < 0.1
- **First Input Delay** - < 100ms

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/email-collector.git

# Navigate to project directory
cd email-collector

# Install dependencies (if any)
npm install

# Start development server
npm run dev
```

### Code Style
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format
- **Semantic Versioning** - Version management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) - Backend services and authentication
- [EmailJS](https://www.emailjs.com/) - Email sending service
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Font Awesome](https://fontawesome.com/) - Icons
- [Inter Font](https://rsms.me/inter/) - Typography
- [CSS Glassmorphism](https://glassmorphism.com/) - Design inspiration

## 📞 Support

### Getting Help
- 📖 **Documentation** - [Full Documentation](https://your-docs-url.com)
- 🐛 **Bug Reports** - [GitHub Issues](https://github.com/yourusername/email-collector/issues)
- 💡 **Feature Requests** - [GitHub Discussions](https://github.com/yourusername/email-collector/discussions)
- 🔒 **Security Issues** - See [SECURITY.md](SECURITY.md) for reporting vulnerabilities
- 📧 **Email Support** - support@yourdomain.com

### Community
- 💬 **Discord** - [Join our Discord](https://discord.gg/your-server)
- 🐦 **Twitter** - [@YourTwitter](https://twitter.com/yourtwitter)
- 📺 **YouTube** - [Tutorial Videos](https://youtube.com/your-channel)

## 🎯 Roadmap

### Upcoming Features
- [ ] **Advanced Analytics** - More detailed insights
- [ ] **A/B Testing** - Form optimization
- [ ] **API Integration** - REST API for developers
- [ ] **Webhook Support** - Real-time integrations
- [ ] **Custom Domains** - White-label solution
- [ ] **Team Collaboration** - Multi-user management

### Version History
- **v2.0.0** - Complete rewrite with modern features
- **v1.5.0** - Added analytics and notifications
- **v1.0.0** - Initial release

## ⭐ Show Your Support

If you find this project helpful, please consider:

- ⭐ **Starring** the repository
- 🍴 **Forking** for your own use
- 📝 **Contributing** improvements
- 📢 **Sharing** with others
- ☕ **Buying us a coffee** - [Support us](https://buymeacoffee.com/yourusername)

---

**Made with ❤️ for the open source community**

*Email Collector - Collect emails like a pro!* 🚀
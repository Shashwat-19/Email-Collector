# Contributing to Email Collector

Thank you for your interest in contributing to Email Collector! We welcome contributions from the community and appreciate your help in making this project better.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:
1. Check if the issue already exists
2. Use the issue templates provided
3. Provide clear steps to reproduce the problem
4. Include relevant system information (browser, OS, etc.)

### Suggesting Features

We love feature suggestions! Please:
1. Check existing feature requests first
2. Provide a clear description of the feature
3. Explain the use case and benefits
4. Consider implementation complexity

### Code Contributions

#### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/Shashwat-19/email-collector.git
   cd email-collector
   ```
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow our coding standards
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   # Run local development server
   python -m http.server 8000
   # or
   npx serve .
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style

- **JavaScript**: Use ES6+ features, meaningful variable names
- **CSS**: Follow BEM methodology, use CSS custom properties
- **HTML**: Semantic HTML5, proper accessibility attributes
- **Comments**: Document complex logic and functions

### File Structure

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
└── 📖 README.md               # Documentation
```

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add email verification system
fix(ui): resolve mobile responsiveness issue
docs(readme): update installation instructions
```

### Testing

- Test your changes across different browsers
- Verify responsive design on mobile devices
- Check accessibility compliance
- Test with different user roles (admin, user)

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update CHANGELOG.md** with your changes
5. **Request review** from maintainers

## 🎯 Areas for Contribution

### High Priority
- [ ] Bug fixes and performance improvements
- [ ] Accessibility enhancements
- [ ] Mobile optimization
- [ ] Security improvements
- [ ] Documentation improvements

### Medium Priority
- [ ] New language translations
- [ ] Additional email templates
- [ ] Enhanced analytics features
- [ ] New authentication methods
- [ ] API improvements

### Low Priority
- [ ] UI/UX enhancements
- [ ] Additional themes
- [ ] Plugin system
- [ ] Advanced customization options

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Browser and version
   - Operating system
   - Device type (desktop/mobile)

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Additional Context**
   - Error messages
   - Console logs
   - Network requests (if relevant)

## 💡 Feature Requests

When suggesting features:

1. **Problem Description**
   - What problem does this solve?
   - Who would benefit from this feature?

2. **Proposed Solution**
   - How should it work?
   - Any design considerations?

3. **Alternatives Considered**
   - What other approaches were considered?
   - Why is this the best solution?

## 📚 Development Resources

### Useful Tools
- [Firebase Console](https://console.firebase.google.com/) - Backend management
- [EmailJS](https://www.emailjs.com/) - Email service
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Font Awesome](https://fontawesome.com/) - Icons

### Learning Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)
- [CSS Grid and Flexbox](https://css-tricks.com/snippets/css/complete-guide-grid/)

## 🏷️ Labels and Tags

We use the following labels for issues and PRs:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority
- `priority: medium` - Medium priority
- `priority: low` - Low priority
- `status: needs triage` - Needs maintainer attention
- `status: in progress` - Currently being worked on

## 📞 Getting Help

- 💬 **Discussions**: Use GitHub Discussions for questions
- 🐛 **Issues**: Use GitHub Issues for bugs and feature requests
- 📧 **Email**: Contact maintainers for sensitive issues
- 💬 **Discord**: Join our community Discord server

## 🎉 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Given credit in the project documentation

## 📄 License

By contributing to Email Collector, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Email Collector! 🚀

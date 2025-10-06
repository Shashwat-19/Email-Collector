// Multi-language support
const translations = {
    en: {
        // Main page
        title: "Email Collector - Open Source",
        subtitle: "Open Source • Firebase Powered • Modern UI",
        formTitle: "Send Your Message",
        formDescription: "Fill out the form below and your data will be securely stored in Firebase",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter your email address",
        messageLabel: "Your Message",
        messagePlaceholder: "Type your message here...",
        sendButton: "Send Message",
        verificationPending: "Please check your email for verification",
        verificationVerified: "Email verified successfully",
        successMessage: "Message sent successfully! Your data has been stored in Firebase.",
        errorMessage: "Something went wrong. Please try again.",
        statsTitle: "Live Statistics",
        totalEmails: "Total Emails",
        today: "Today",
        visitors: "Visitors",
        conversion: "Conversion",
        featuresTitle: "Why Choose This Email Collector?",
        secureStorage: "Secure Storage",
        secureStorageDesc: "Your data is securely stored in Firebase with enterprise-grade security",
        openSource: "Open Source",
        openSourceDesc: "Completely open source - customize and integrate into your projects",
        responsiveDesign: "Responsive Design",
        responsiveDesignDesc: "Works perfectly on all devices - desktop, tablet, and mobile",
        fastModern: "Fast & Modern",
        fastModernDesc: "Built with modern web technologies for optimal performance",
        adminDashboard: "Admin Dashboard",
        footerText: "© 2024 Email Collector. Open Source Project.",
        github: "GitHub",
        documentation: "Documentation",
        
        // Validation messages
        emailRequired: "Email address is required",
        emailInvalid: "Please enter a valid email address",
        messageRequired: "Message is required",
        messageTooShort: "Message must be at least 10 characters long",
        rateLimitExceeded: "Too many submissions. Please wait {seconds} seconds before trying again.",
        
        // Admin dashboard
        adminTitle: "Admin Dashboard",
        backToForm: "Back to Form",
        totalEmailsAdmin: "Total Emails",
        todayAdmin: "Today",
        verified: "Verified",
        conversionAdmin: "Conversion",
        submissionsChart: "Submissions Over Time",
        verificationChart: "Email Verification Status",
        collectedEmails: "Collected Emails",
        refresh: "Refresh",
        exportCSV: "Export CSV",
        exportJSON: "Export JSON",
        dateRange: "Date Range",
        allTime: "All Time",
        todayFilter: "Today",
        thisWeek: "This Week",
        thisMonth: "This Month",
        verificationFilter: "Verification",
        all: "All",
        verifiedOnly: "Verified Only",
        unverifiedOnly: "Unverified Only",
        search: "Search",
        searchPlaceholder: "Search emails...",
        email: "Email",
        message: "Message",
        date: "Date",
        status: "Status",
        ipAddress: "IP Address",
        actions: "Actions",
        viewDetails: "View Details",
        delete: "Delete",
        emailTemplates: "Email Templates",
        addTemplate: "Add Template",
        emailDetails: "Email Details",
        userAgent: "User Agent",
        deleteConfirm: "Are you sure you want to delete this email?",
        deleteError: "Error deleting email. Please try again."
    },
    
    es: {
        // Main page
        title: "Recolector de Emails - Código Abierto",
        subtitle: "Código Abierto • Alimentado por Firebase • UI Moderna",
        formTitle: "Envía tu Mensaje",
        formDescription: "Completa el formulario a continuación y tus datos se almacenarán de forma segura en Firebase",
        emailLabel: "Dirección de Email",
        emailPlaceholder: "Ingresa tu dirección de email",
        messageLabel: "Tu Mensaje",
        messagePlaceholder: "Escribe tu mensaje aquí...",
        sendButton: "Enviar Mensaje",
        verificationPending: "Por favor revisa tu email para verificación",
        verificationVerified: "Email verificado exitosamente",
        successMessage: "¡Mensaje enviado exitosamente! Tus datos han sido almacenados en Firebase.",
        errorMessage: "Algo salió mal. Por favor intenta de nuevo.",
        statsTitle: "Estadísticas en Vivo",
        totalEmails: "Total de Emails",
        today: "Hoy",
        visitors: "Visitantes",
        conversion: "Conversión",
        featuresTitle: "¿Por qué elegir este Recolector de Emails?",
        secureStorage: "Almacenamiento Seguro",
        secureStorageDesc: "Tus datos se almacenan de forma segura en Firebase con seguridad de nivel empresarial",
        openSource: "Código Abierto",
        openSourceDesc: "Completamente de código abierto - personaliza e integra en tus proyectos",
        responsiveDesign: "Diseño Responsivo",
        responsiveDesignDesc: "Funciona perfectamente en todos los dispositivos - escritorio, tablet y móvil",
        fastModern: "Rápido y Moderno",
        fastModernDesc: "Construido con tecnologías web modernas para un rendimiento óptimo",
        adminDashboard: "Panel de Administración",
        footerText: "© 2024 Recolector de Emails. Proyecto de Código Abierto.",
        github: "GitHub",
        documentation: "Documentación",
        
        // Validation messages
        emailRequired: "La dirección de email es requerida",
        emailInvalid: "Por favor ingresa una dirección de email válida",
        messageRequired: "El mensaje es requerido",
        messageTooShort: "El mensaje debe tener al menos 10 caracteres",
        rateLimitExceeded: "Demasiados envíos. Por favor espera {seconds} segundos antes de intentar de nuevo.",
        
        // Admin dashboard
        adminTitle: "Panel de Administración",
        backToForm: "Volver al Formulario",
        totalEmailsAdmin: "Total de Emails",
        todayAdmin: "Hoy",
        verified: "Verificado",
        conversionAdmin: "Conversión",
        submissionsChart: "Envíos a lo Largo del Tiempo",
        verificationChart: "Estado de Verificación de Emails",
        collectedEmails: "Emails Recolectados",
        refresh: "Actualizar",
        exportCSV: "Exportar CSV",
        exportJSON: "Exportar JSON",
        dateRange: "Rango de Fechas",
        allTime: "Todo el Tiempo",
        todayFilter: "Hoy",
        thisWeek: "Esta Semana",
        thisMonth: "Este Mes",
        verificationFilter: "Verificación",
        all: "Todos",
        verifiedOnly: "Solo Verificados",
        unverifiedOnly: "Solo No Verificados",
        search: "Buscar",
        searchPlaceholder: "Buscar emails...",
        email: "Email",
        message: "Mensaje",
        date: "Fecha",
        status: "Estado",
        ipAddress: "Dirección IP",
        actions: "Acciones",
        viewDetails: "Ver Detalles",
        delete: "Eliminar",
        emailTemplates: "Plantillas de Email",
        addTemplate: "Agregar Plantilla",
        emailDetails: "Detalles del Email",
        userAgent: "Agente de Usuario",
        deleteConfirm: "¿Estás seguro de que quieres eliminar este email?",
        deleteError: "Error al eliminar el email. Por favor intenta de nuevo."
    },
    
    fr: {
        // Main page
        title: "Collecteur d'Emails - Open Source",
        subtitle: "Open Source • Alimenté par Firebase • UI Moderne",
        formTitle: "Envoyez votre Message",
        formDescription: "Remplissez le formulaire ci-dessous et vos données seront stockées en toute sécurité dans Firebase",
        emailLabel: "Adresse Email",
        emailPlaceholder: "Entrez votre adresse email",
        messageLabel: "Votre Message",
        messagePlaceholder: "Tapez votre message ici...",
        sendButton: "Envoyer le Message",
        verificationPending: "Veuillez vérifier votre email pour la vérification",
        verificationVerified: "Email vérifié avec succès",
        successMessage: "Message envoyé avec succès ! Vos données ont été stockées dans Firebase.",
        errorMessage: "Quelque chose s'est mal passé. Veuillez réessayer.",
        statsTitle: "Statistiques en Direct",
        totalEmails: "Total des Emails",
        today: "Aujourd'hui",
        visitors: "Visiteurs",
        conversion: "Conversion",
        featuresTitle: "Pourquoi choisir ce Collecteur d'Emails ?",
        secureStorage: "Stockage Sécurisé",
        secureStorageDesc: "Vos données sont stockées en toute sécurité dans Firebase avec une sécurité de niveau entreprise",
        openSource: "Open Source",
        openSourceDesc: "Complètement open source - personnalisez et intégrez dans vos projets",
        responsiveDesign: "Design Responsive",
        responsiveDesignDesc: "Fonctionne parfaitement sur tous les appareils - bureau, tablette et mobile",
        fastModern: "Rapide et Moderne",
        fastModernDesc: "Construit avec des technologies web modernes pour des performances optimales",
        adminDashboard: "Tableau de Bord Admin",
        footerText: "© 2024 Collecteur d'Emails. Projet Open Source.",
        github: "GitHub",
        documentation: "Documentation",
        
        // Validation messages
        emailRequired: "L'adresse email est requise",
        emailInvalid: "Veuillez entrer une adresse email valide",
        messageRequired: "Le message est requis",
        messageTooShort: "Le message doit contenir au moins 10 caractères",
        rateLimitExceeded: "Trop de soumissions. Veuillez attendre {seconds} secondes avant de réessayer.",
        
        // Admin dashboard
        adminTitle: "Tableau de Bord Admin",
        backToForm: "Retour au Formulaire",
        totalEmailsAdmin: "Total des Emails",
        todayAdmin: "Aujourd'hui",
        verified: "Vérifié",
        conversionAdmin: "Conversion",
        submissionsChart: "Soumissions dans le Temps",
        verificationChart: "Statut de Vérification Email",
        collectedEmails: "Emails Collectés",
        refresh: "Actualiser",
        exportCSV: "Exporter CSV",
        exportJSON: "Exporter JSON",
        dateRange: "Plage de Dates",
        allTime: "Tout le Temps",
        todayFilter: "Aujourd'hui",
        thisWeek: "Cette Semaine",
        thisMonth: "Ce Mois",
        verificationFilter: "Vérification",
        all: "Tous",
        verifiedOnly: "Vérifiés Seulement",
        unverifiedOnly: "Non Vérifiés Seulement",
        search: "Rechercher",
        searchPlaceholder: "Rechercher des emails...",
        email: "Email",
        message: "Message",
        date: "Date",
        status: "Statut",
        ipAddress: "Adresse IP",
        actions: "Actions",
        viewDetails: "Voir les Détails",
        delete: "Supprimer",
        emailTemplates: "Modèles d'Email",
        addTemplate: "Ajouter un Modèle",
        emailDetails: "Détails de l'Email",
        userAgent: "Agent Utilisateur",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer cet email ?",
        deleteError: "Erreur lors de la suppression de l'email. Veuillez réessayer."
    },
    
    de: {
        // Main page
        title: "E-Mail-Sammler - Open Source",
        subtitle: "Open Source • Firebase Powered • Moderne UI",
        formTitle: "Senden Sie Ihre Nachricht",
        formDescription: "Füllen Sie das untenstehende Formular aus und Ihre Daten werden sicher in Firebase gespeichert",
        emailLabel: "E-Mail-Adresse",
        emailPlaceholder: "Geben Sie Ihre E-Mail-Adresse ein",
        messageLabel: "Ihre Nachricht",
        messagePlaceholder: "Geben Sie hier Ihre Nachricht ein...",
        sendButton: "Nachricht Senden",
        verificationPending: "Bitte überprüfen Sie Ihre E-Mail zur Verifizierung",
        verificationVerified: "E-Mail erfolgreich verifiziert",
        successMessage: "Nachricht erfolgreich gesendet! Ihre Daten wurden in Firebase gespeichert.",
        errorMessage: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
        statsTitle: "Live-Statistiken",
        totalEmails: "Gesamte E-Mails",
        today: "Heute",
        visitors: "Besucher",
        conversion: "Konversion",
        featuresTitle: "Warum diesen E-Mail-Sammler wählen?",
        secureStorage: "Sichere Speicherung",
        secureStorageDesc: "Ihre Daten werden sicher in Firebase mit Unternehmenssicherheit gespeichert",
        openSource: "Open Source",
        openSourceDesc: "Vollständig open source - anpassen und in Ihre Projekte integrieren",
        responsiveDesign: "Responsives Design",
        responsiveDesignDesc: "Funktioniert perfekt auf allen Geräten - Desktop, Tablet und Mobil",
        fastModern: "Schnell & Modern",
        fastModernDesc: "Erstellt mit modernen Web-Technologien für optimale Leistung",
        adminDashboard: "Admin-Dashboard",
        footerText: "© 2024 E-Mail-Sammler. Open Source Projekt.",
        github: "GitHub",
        documentation: "Dokumentation",
        
        // Validation messages
        emailRequired: "E-Mail-Adresse ist erforderlich",
        emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        messageRequired: "Nachricht ist erforderlich",
        messageTooShort: "Nachricht muss mindestens 10 Zeichen lang sein",
        rateLimitExceeded: "Zu viele Übermittlungen. Bitte warten Sie {seconds} Sekunden, bevor Sie es erneut versuchen.",
        
        // Admin dashboard
        adminTitle: "Admin-Dashboard",
        backToForm: "Zurück zum Formular",
        totalEmailsAdmin: "Gesamte E-Mails",
        todayAdmin: "Heute",
        verified: "Verifiziert",
        conversionAdmin: "Konversion",
        submissionsChart: "Übermittlungen über die Zeit",
        verificationChart: "E-Mail-Verifizierungsstatus",
        collectedEmails: "Gesammelte E-Mails",
        refresh: "Aktualisieren",
        exportCSV: "CSV Exportieren",
        exportJSON: "JSON Exportieren",
        dateRange: "Datumsbereich",
        allTime: "Alle Zeit",
        todayFilter: "Heute",
        thisWeek: "Diese Woche",
        thisMonth: "Dieser Monat",
        verificationFilter: "Verifizierung",
        all: "Alle",
        verifiedOnly: "Nur Verifizierte",
        unverifiedOnly: "Nur Nicht Verifizierte",
        search: "Suchen",
        searchPlaceholder: "E-Mails suchen...",
        email: "E-Mail",
        message: "Nachricht",
        date: "Datum",
        status: "Status",
        ipAddress: "IP-Adresse",
        actions: "Aktionen",
        viewDetails: "Details Anzeigen",
        delete: "Löschen",
        emailTemplates: "E-Mail-Vorlagen",
        addTemplate: "Vorlage Hinzufügen",
        emailDetails: "E-Mail-Details",
        userAgent: "Benutzer-Agent",
        deleteConfirm: "Sind Sie sicher, dass Sie diese E-Mail löschen möchten?",
        deleteError: "Fehler beim Löschen der E-Mail. Bitte versuchen Sie es erneut."
    }
};

// Language management
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.init();
    }

    init() {
        this.updateLanguage(this.currentLanguage);
        this.createLanguageSwitcher();
    }

    createLanguageSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="language-btn" id="languageBtn">
                <i class="fas fa-globe"></i>
                <span id="currentLang">${this.currentLanguage.toUpperCase()}</span>
            </button>
            <div class="language-dropdown" id="languageDropdown">
                <button onclick="languageManager.setLanguage('en')" class="language-option ${this.currentLanguage === 'en' ? 'active' : ''}">
                    🇺🇸 English
                </button>
                <button onclick="languageManager.setLanguage('es')" class="language-option ${this.currentLanguage === 'es' ? 'active' : ''}">
                    🇪🇸 Español
                </button>
                <button onclick="languageManager.setLanguage('fr')" class="language-option ${this.currentLanguage === 'fr' ? 'active' : ''}">
                    🇫🇷 Français
                </button>
                <button onclick="languageManager.setLanguage('de')" class="language-option ${this.currentLanguage === 'de' ? 'active' : ''}">
                    🇩🇪 Deutsch
                </button>
            </div>
        `;
        
        document.body.appendChild(switcher);
        
        // Toggle dropdown
        document.getElementById('languageBtn').addEventListener('click', () => {
            const dropdown = document.getElementById('languageDropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!switcher.contains(e.target)) {
                document.getElementById('languageDropdown').style.display = 'none';
            }
        });
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.updateLanguage(lang);
        document.getElementById('languageDropdown').style.display = 'none';
    }

    updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update placeholders
        const placeholders = document.querySelectorAll('[data-translate-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Update current language indicator
        const currentLangEl = document.getElementById('currentLang');
        if (currentLangEl) {
            currentLangEl.textContent = lang.toUpperCase();
        }

        // Update active language option
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
        });
        const activeOption = document.querySelector(`[onclick="languageManager.setLanguage('${lang}')"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }

    translate(key, params = {}) {
        let translation = translations[this.currentLanguage][key] || translations['en'][key] || key;
        
        // Replace parameters
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }
}

// Initialize language manager
window.languageManager = new LanguageManager();

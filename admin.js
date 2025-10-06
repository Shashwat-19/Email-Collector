// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const totalEmailsEl = document.getElementById('totalEmails');
    const todayEmailsEl = document.getElementById('todayEmails');
    const verifiedEmailsEl = document.getElementById('verifiedEmails');
    const conversionRateEl = document.getElementById('conversionRate');
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const emailsTableBody = document.getElementById('emailsTableBody');
    const pagination = document.getElementById('pagination');
    const emailModal = document.getElementById('emailModal');
    const closeModal = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');
    
    // Filter elements
    const dateFilter = document.getElementById('dateFilter');
    const verificationFilter = document.getElementById('verificationFilter');
    const searchInput = document.getElementById('searchInput');
    
    // Chart elements
    const submissionsChart = document.getElementById('submissionsChart');
    const verificationChart = document.getElementById('verificationChart');
    
    // State
    let allEmails = [];
    let filteredEmails = [];
    let currentPage = 1;
    const emailsPerPage = 10;
    let charts = {};

    // Initialize
    init();

    function init() {
        // Initialize theme toggle
        initThemeToggle();
        
        // Load data
        loadDashboardData();
        
        // Initialize charts
        initCharts();
        
        // Set up event listeners
        setupEventListeners();
        
        // Set up real-time updates
        setInterval(loadDashboardData, 30000); // Update every 30 seconds
    }

    // Theme Toggle (same as main app)
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;
        
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
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

    // Event Listeners
    function setupEventListeners() {
        refreshBtn.addEventListener('click', loadDashboardData);
        exportBtn.addEventListener('click', exportToCSV);
        exportJsonBtn.addEventListener('click', exportToJSON);
        closeModal.addEventListener('click', closeEmailModal);
        
        // Filter listeners
        dateFilter.addEventListener('change', applyFilters);
        verificationFilter.addEventListener('change', applyFilters);
        searchInput.addEventListener('input', debounce(applyFilters, 300));
        
        // Modal close on outside click
        emailModal.addEventListener('click', function(e) {
            if (e.target === emailModal) {
                closeEmailModal();
            }
        });
    }

    // Load Dashboard Data
    async function loadDashboardData() {
        try {
            if (!window.db) {
                console.error('Firebase not initialized');
                return;
            }

            // Load emails
            const emailsSnapshot = await db.collection('emails').orderBy('timestamp', 'desc').get();
            allEmails = emailsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load verification data
            const verificationsSnapshot = await db.collection('email_verifications').get();
            const verifications = verificationsSnapshot.docs.map(doc => doc.data());

            // Calculate statistics
            const stats = calculateStatistics(allEmails, verifications);
            updateStatistics(stats);
            
            // Update charts
            updateCharts(allEmails, verifications);
            
            // Apply filters and render table
            applyFilters();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Calculate Statistics
    function calculateStatistics(emails, verifications) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const totalEmails = emails.length;
        const todayEmails = emails.filter(email => {
            const emailDate = email.timestamp?.toDate() || new Date(email.timestamp);
            return emailDate >= today;
        }).length;
        
        const verifiedEmails = verifications.filter(v => v.verified).length;
        const conversionRate = totalEmails > 0 ? Math.round((verifiedEmails / totalEmails) * 100) : 0;
        
        return {
            totalEmails,
            todayEmails,
            verifiedEmails,
            conversionRate
        };
    }

    // Update Statistics Display
    function updateStatistics(stats) {
        animateNumber(totalEmailsEl, stats.totalEmails);
        animateNumber(todayEmailsEl, stats.todayEmails);
        animateNumber(verifiedEmailsEl, stats.verifiedEmails);
        animateNumber(conversionRateEl, stats.conversionRate + '%');
    }

    // Animate Numbers
    function animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const target = parseInt(targetValue) || 0;
        
        if (currentValue === target) return;
        
        const increment = Math.ceil((target - currentValue) / 20);
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

    // Initialize Charts
    function initCharts() {
        // Submissions Chart
        const submissionsCtx = submissionsChart.getContext('2d');
        charts.submissions = new Chart(submissionsCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Submissions',
                    data: [],
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ffffff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });

        // Verification Chart
        const verificationCtx = verificationChart.getContext('2d');
        charts.verification = new Chart(verificationCtx, {
            type: 'doughnut',
            data: {
                labels: ['Verified', 'Pending'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#10b981', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    // Update Charts
    function updateCharts(emails, verifications) {
        // Update submissions chart
        const last7Days = getLast7Days();
        const submissionsData = last7Days.map(date => {
            return emails.filter(email => {
                const emailDate = email.timestamp?.toDate() || new Date(email.timestamp);
                return emailDate.toDateString() === date.toDateString();
            }).length;
        });

        charts.submissions.data.labels = last7Days.map(date => 
            date.toLocaleDateString('en-US', { weekday: 'short' })
        );
        charts.submissions.data.datasets[0].data = submissionsData;
        charts.submissions.update();

        // Update verification chart
        const verified = verifications.filter(v => v.verified).length;
        const pending = verifications.filter(v => !v.verified).length;
        
        charts.verification.data.datasets[0].data = [verified, pending];
        charts.verification.update();
    }

    // Get Last 7 Days
    function getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    }

    // Apply Filters
    function applyFilters() {
        let filtered = [...allEmails];
        
        // Date filter
        const dateFilterValue = dateFilter.value;
        if (dateFilterValue !== 'all') {
            const now = new Date();
            let startDate;
            
            switch (dateFilterValue) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
            }
            
            filtered = filtered.filter(email => {
                const emailDate = email.timestamp?.toDate() || new Date(email.timestamp);
                return emailDate >= startDate;
            });
        }
        
        // Verification filter
        const verificationFilterValue = verificationFilter.value;
        if (verificationFilterValue !== 'all') {
            // This would require checking verification status
            // For now, we'll skip this filter
        }
        
        // Search filter
        const searchValue = searchInput.value.toLowerCase();
        if (searchValue) {
            filtered = filtered.filter(email => 
                email.email.toLowerCase().includes(searchValue) ||
                email.message.toLowerCase().includes(searchValue)
            );
        }
        
        filteredEmails = filtered;
        currentPage = 1;
        renderEmailsTable();
        renderPagination();
    }

    // Render Emails Table
    function renderEmailsTable() {
        const startIndex = (currentPage - 1) * emailsPerPage;
        const endIndex = startIndex + emailsPerPage;
        const pageEmails = filteredEmails.slice(startIndex, endIndex);
        
        emailsTableBody.innerHTML = pageEmails.map(email => `
            <tr>
                <td class="email-cell">${email.email}</td>
                <td class="message-cell">${email.message}</td>
                <td>${formatDate(email.timestamp)}</td>
                <td>
                    <span class="status-badge status-verified">
                        <i class="fas fa-check-circle"></i>
                        Verified
                    </span>
                </td>
                <td>${email.ipAddress || 'N/A'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="viewEmailDetails('${email.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="deleteEmail('${email.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Render Pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                paginationHTML += `
                    <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                            onclick="changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                    onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    // Change Page
    window.changePage = function(page) {
        const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderEmailsTable();
            renderPagination();
        }
    };

    // View Email Details
    window.viewEmailDetails = function(emailId) {
        const email = allEmails.find(e => e.id === emailId);
        if (!email) return;
        
        modalBody.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${email.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Message:</span>
                <span class="detail-value">${email.message}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formatDate(email.timestamp)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">IP Address:</span>
                <span class="detail-value">${email.ipAddress || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">User Agent:</span>
                <span class="detail-value">${email.userAgent || 'N/A'}</span>
            </div>
        `;
        
        emailModal.classList.add('show');
    };

    // Close Email Modal
    function closeEmailModal() {
        emailModal.classList.remove('show');
    }

    // Delete Email
    window.deleteEmail = async function(emailId) {
        if (!confirm('Are you sure you want to delete this email?')) return;
        
        try {
            await db.collection('emails').doc(emailId).delete();
            loadDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error deleting email:', error);
            alert('Error deleting email. Please try again.');
        }
    };

    // Export to CSV
    function exportToCSV() {
        const headers = ['Email', 'Message', 'Date', 'IP Address', 'User Agent'];
        const csvContent = [
            headers.join(','),
            ...filteredEmails.map(email => [
                `"${email.email}"`,
                `"${email.message.replace(/"/g, '""')}"`,
                `"${formatDate(email.timestamp)}"`,
                `"${email.ipAddress || 'N/A'}"`,
                `"${email.userAgent || 'N/A'}"`
            ].join(','))
        ].join('\n');
        
        downloadFile(csvContent, 'emails.csv', 'text/csv');
    }

    // Export to JSON
    function exportToJSON() {
        const jsonContent = JSON.stringify(filteredEmails, null, 2);
        downloadFile(jsonContent, 'emails.json', 'application/json');
    }

    // Download File
    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Format Date
    function formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    }

    // Debounce Function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});

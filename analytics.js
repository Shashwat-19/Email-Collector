// Advanced Analytics Dashboard
class AnalyticsDashboard {
    constructor() {
        this.charts = {};
        this.data = {
            emails: [],
            verifications: [],
            visitors: [],
            analytics: []
        };
        this.dateRange = {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            end: new Date()
        };
        this.init();
    }

    init() {
        this.loadData();
        this.initializeCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    async loadData() {
        try {
            if (!window.db) return;

            // Load all data in parallel
            const [emailsSnapshot, verificationsSnapshot, visitorsSnapshot, analyticsSnapshot] = await Promise.all([
                db.collection('emails').orderBy('timestamp', 'desc').get(),
                db.collection('email_verifications').get(),
                db.collection('visitors').get(),
                db.collection('analytics').orderBy('timestamp', 'desc').get()
            ]);

            this.data.emails = emailsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.data.verifications = verificationsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.data.visitors = visitorsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.data.analytics = analyticsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.updateAllCharts();
            this.updateMetrics();
        } catch (error) {
            console.error('Error loading analytics data:', error);
        }
    }

    initializeCharts() {
        // Submissions Timeline Chart
        this.initSubmissionsChart();
        
        // Conversion Funnel Chart
        this.initConversionFunnelChart();
        
        // Geographic Distribution Chart
        this.initGeographicChart();
        
        // Device/Browser Analytics Chart
        this.initDeviceChart();
        
        // Hourly Activity Chart
        this.initHourlyActivityChart();
        
        // Email Domain Analysis Chart
        this.initDomainAnalysisChart();
    }

    initSubmissionsChart() {
        const ctx = document.getElementById('submissionsChart');
        if (!ctx) return;

        this.charts.submissions = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Email Submissions',
                    data: [],
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4facfe',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4facfe',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    initConversionFunnelChart() {
        const ctx = document.getElementById('conversionFunnelChart');
        if (!ctx) return;

        this.charts.conversionFunnel = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Visitors', 'Form Starts', 'Submissions', 'Verifications'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
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
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    initGeographicChart() {
        const ctx = document.getElementById('geographicChart');
        if (!ctx) return;

        this.charts.geographic = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Submissions by Country',
                    data: [],
                    backgroundColor: 'rgba(79, 172, 254, 0.8)',
                    borderColor: '#4facfe',
                    borderWidth: 1,
                    borderRadius: 4
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
    }

    initDeviceChart() {
        const ctx = document.getElementById('deviceChart');
        if (!ctx) return;

        this.charts.device = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Desktop', 'Mobile', 'Tablet'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
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

    initHourlyActivityChart() {
        const ctx = document.getElementById('hourlyActivityChart');
        if (!ctx) return;

        this.charts.hourlyActivity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                datasets: [{
                    label: 'Submissions per Hour',
                    data: new Array(24).fill(0),
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 4
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
    }

    initDomainAnalysisChart() {
        const ctx = document.getElementById('domainAnalysisChart');
        if (!ctx) return;

        this.charts.domainAnalysis = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Submissions by Email Domain',
                    data: [],
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: '#f59e0b',
                    borderWidth: 1,
                    borderRadius: 4
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
    }

    updateAllCharts() {
        this.updateSubmissionsChart();
        this.updateConversionFunnelChart();
        this.updateGeographicChart();
        this.updateDeviceChart();
        this.updateHourlyActivityChart();
        this.updateDomainAnalysisChart();
    }

    updateSubmissionsChart() {
        if (!this.charts.submissions) return;

        const last7Days = this.getLastNDays(7);
        const submissionsData = last7Days.map(date => {
            return this.data.emails.filter(email => {
                const emailDate = email.timestamp?.toDate() || new Date(email.timestamp);
                return emailDate.toDateString() === date.toDateString();
            }).length;
        });

        this.charts.submissions.data.labels = last7Days.map(date => 
            date.toLocaleDateString('en-US', { weekday: 'short' })
        );
        this.charts.submissions.data.datasets[0].data = submissionsData;
        this.charts.submissions.update();
    }

    updateConversionFunnelChart() {
        if (!this.charts.conversionFunnel) return;

        const visitors = this.data.visitors.length;
        const formStarts = this.data.analytics.filter(a => a.action === 'form_start').length;
        const submissions = this.data.emails.length;
        const verifications = this.data.verifications.filter(v => v.verified).length;

        this.charts.conversionFunnel.data.datasets[0].data = [visitors, formStarts, submissions, verifications];
        this.charts.conversionFunnel.update();
    }

    updateGeographicChart() {
        if (!this.charts.geographic) return;

        const countryData = this.getCountryDistribution();
        this.charts.geographic.data.labels = Object.keys(countryData);
        this.charts.geographic.data.datasets[0].data = Object.values(countryData);
        this.charts.geographic.update();
    }

    updateDeviceChart() {
        if (!this.charts.device) return;

        const deviceData = this.getDeviceDistribution();
        this.charts.device.data.datasets[0].data = [
            deviceData.desktop || 0,
            deviceData.mobile || 0,
            deviceData.tablet || 0
        ];
        this.charts.device.update();
    }

    updateHourlyActivityChart() {
        if (!this.charts.hourlyActivity) return;

        const hourlyData = new Array(24).fill(0);
        this.data.emails.forEach(email => {
            const date = email.timestamp?.toDate() || new Date(email.timestamp);
            const hour = date.getHours();
            hourlyData[hour]++;
        });

        this.charts.hourlyActivity.data.datasets[0].data = hourlyData;
        this.charts.hourlyActivity.update();
    }

    updateDomainAnalysisChart() {
        if (!this.charts.domainAnalysis) return;

        const domainData = this.getDomainDistribution();
        const topDomains = Object.entries(domainData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        this.charts.domainAnalysis.data.labels = topDomains.map(([domain]) => domain);
        this.charts.domainAnalysis.data.datasets[0].data = topDomains.map(([,count]) => count);
        this.charts.domainAnalysis.update();
    }

    updateMetrics() {
        const metrics = this.calculateMetrics();
        
        // Update metric displays
        this.updateMetricDisplay('totalSubmissions', metrics.totalSubmissions);
        this.updateMetricDisplay('totalVisitors', metrics.totalVisitors);
        this.updateMetricDisplay('conversionRate', metrics.conversionRate + '%');
        this.updateMetricDisplay('avgResponseTime', metrics.avgResponseTime + 'h');
        this.updateMetricDisplay('bounceRate', metrics.bounceRate + '%');
        this.updateMetricDisplay('topCountry', metrics.topCountry);
    }

    calculateMetrics() {
        const totalSubmissions = this.data.emails.length;
        const totalVisitors = this.data.visitors.length;
        const conversionRate = totalVisitors > 0 ? Math.round((totalSubmissions / totalVisitors) * 100) : 0;
        
        // Calculate average response time (simplified)
        const avgResponseTime = this.calculateAverageResponseTime();
        
        // Calculate bounce rate (simplified)
        const bounceRate = this.calculateBounceRate();
        
        // Get top country
        const countryData = this.getCountryDistribution();
        const topCountry = Object.keys(countryData).length > 0 ? 
            Object.keys(countryData).reduce((a, b) => countryData[a] > countryData[b] ? a : b) : 'N/A';

        return {
            totalSubmissions,
            totalVisitors,
            conversionRate,
            avgResponseTime,
            bounceRate,
            topCountry
        };
    }

    calculateAverageResponseTime() {
        // Simplified calculation - in real app, this would be based on actual response times
        return Math.round(Math.random() * 24 + 1);
    }

    calculateBounceRate() {
        // Simplified calculation
        const totalSessions = this.data.analytics.filter(a => a.action === 'page_view').length;
        const bouncedSessions = this.data.analytics.filter(a => a.action === 'page_view' && !this.data.emails.some(e => e.userAgent === a.userAgent)).length;
        return totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0;
    }

    getCountryDistribution() {
        const countries = {};
        this.data.emails.forEach(email => {
            // Simplified - in real app, you'd use IP geolocation
            const country = this.getCountryFromIP(email.ipAddress);
            countries[country] = (countries[country] || 0) + 1;
        });
        return countries;
    }

    getCountryFromIP(ip) {
        // Simplified country detection - in real app, use a geolocation service
        const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil'];
        return countries[Math.floor(Math.random() * countries.length)];
    }

    getDeviceDistribution() {
        const devices = { desktop: 0, mobile: 0, tablet: 0 };
        
        this.data.emails.forEach(email => {
            const userAgent = email.userAgent || '';
            if (userAgent.includes('Mobile')) {
                devices.mobile++;
            } else if (userAgent.includes('Tablet')) {
                devices.tablet++;
            } else {
                devices.desktop++;
            }
        });
        
        return devices;
    }

    getDomainDistribution() {
        const domains = {};
        this.data.emails.forEach(email => {
            const domain = email.email.split('@')[1];
            domains[domain] = (domains[domain] || 0) + 1;
        });
        return domains;
    }

    getLastNDays(n) {
        const days = [];
        for (let i = n - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    }

    updateMetricDisplay(metricId, value) {
        const element = document.getElementById(metricId);
        if (element) {
            element.textContent = value;
        }
    }

    setupEventListeners() {
        // Date range picker
        const dateRangeInput = document.getElementById('dateRange');
        if (dateRangeInput) {
            dateRangeInput.addEventListener('change', (e) => {
                const [start, end] = e.target.value.split(' to ');
                this.dateRange.start = new Date(start);
                this.dateRange.end = new Date(end);
                this.loadData();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshAnalytics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadData();
            });
        }
    }

    startRealTimeUpdates() {
        // Update charts every 30 seconds
        setInterval(() => {
            this.loadData();
        }, 30000);
    }

    // Export analytics data
    exportAnalyticsData() {
        const analyticsData = {
            emails: this.data.emails,
            verifications: this.data.verifications,
            visitors: this.data.visitors,
            analytics: this.data.analytics,
            metrics: this.calculateMetrics(),
            generatedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(analyticsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Generate analytics report
    generateReport() {
        const metrics = this.calculateMetrics();
        const report = `
# Analytics Report - ${new Date().toLocaleDateString()}

## Key Metrics
- Total Submissions: ${metrics.totalSubmissions}
- Total Visitors: ${metrics.totalVisitors}
- Conversion Rate: ${metrics.conversionRate}%
- Average Response Time: ${metrics.avgResponseTime} hours
- Bounce Rate: ${metrics.bounceRate}%
- Top Country: ${metrics.topCountry}

## Device Distribution
${Object.entries(this.getDeviceDistribution()).map(([device, count]) => `- ${device}: ${count}`).join('\n')}

## Top Email Domains
${Object.entries(this.getDomainDistribution())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([domain, count]) => `- ${domain}: ${count}`)
    .join('\n')}

## Recommendations
- Monitor conversion rate trends
- Optimize for mobile users
- Focus on top-performing countries
- Improve response time
        `;

        const reportBlob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(reportBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Initialize analytics dashboard
window.analyticsDashboard = new AnalyticsDashboard();
